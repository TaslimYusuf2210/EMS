import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../../../components/ui/dialog';
import { useGetDepartments } from '../../../hooks/useQuery/useGetDepartments';
import { useCreateEmployee } from '../../../hooks/useMutation/useCreateEmployee';
import { useGetDepartmentPositions } from '../../../hooks/useQuery/useGetDepartmentPositions';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';

const baseEmployeeSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required (min 2 characters)' }),
  lastName: z.string().min(2, { message: 'Last name is required (min 2 characters)' }),
  email: z.string().email({ message: 'A valid email address is required' }),
  phoneNumber: z.string().min(6, { message: 'Phone number is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  department: z.string().optional(),
  position: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern', 'Remote']),
  hireDate: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Probation', 'Resigned', 'Terminated', 'OnLeave']).optional(),
});

const employeeSchema = baseEmployeeSchema.superRefine((data, ctx) => {
  if (data.department && (!data.position || data.position.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['position'],
      message: 'Position is required when a department is selected',
    });
  }
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

const STEPS = ['Personal Info', 'Employment', 'Review', 'Done'];

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddEmployeeDialog({ open, onClose }: AddEmployeeDialogProps) {
    const [step, setStep] = useState(0);
    const { mutateAsync: createEmployee, isPending: isCreatingEmployee } = useCreateEmployee({
      onSuccess: () => setStep(3),
    });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { data: departmentsData } = useGetDepartments();
  const departments = departmentsData ?? [];

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'Male',
      department: '',
      position: '',
      employmentType: 'Full-time',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    },
  });

  const selectedDepartmentName = watch('department');
  const selectedDepartmentId = departments.find((d) => d.name === selectedDepartmentName)?.id ?? '';
  const { data: positionsData } = useGetDepartmentPositions(selectedDepartmentId || '');
  const positionsList = positionsData ?? [];

  const stepFields: (keyof EmployeeFormValues)[][] = [
    ['firstName', 'lastName', 'email', 'phoneNumber', 'gender'],
    ['department', 'position', 'employmentType'],
    [],
    [],
  ];

  const goToStep = (target: number) => {
    if (target === step) return;
    if (target > step) return;
    if (completedSteps.has(target) || target < step) {
      setStep(target);
    }
  };

  const handleNext = async () => {
    const fields = stepFields[step];
    if (fields.length === 0) {
      setStep((s) => s + 1);
      return;
    }
    const valid = await trigger(fields);
    if (!valid) return;
    setCompletedSteps((prev) => new Set(prev).add(step));
    setStep((s) => s + 1);
  };

  const handleClose = () => {
    setStep(0);
    setCompletedSteps(new Set());
    reset();
    onClose();
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    if (step < 2) return;
    await createEmployee({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      department: data.department || '',
      position: data.position || '',
      employmentType: data.employmentType,
      hireDate: data.hireDate,
      status: data.status,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {/* Close Icon */}
      <div className="flex justify-end -mt-1 -mr-1 mb-3">
        <button
          type="button"
          onClick={handleClose}
          className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => {
          const isActive = i <= step;
          const isCompleted = i < step;
          const canClick = completedSteps.has(i) || i === step;
          return (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <button
                type="button"
                disabled={!canClick || step === 3}
                onClick={() => goToStep(i)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors cursor-pointer disabled:cursor-default ${
                  isActive || isCompleted ? 'bg-[#ccd5ae] text-neutral-950' : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </button>
              <span className={`text-[10px] font-bold hidden sm:block ${isActive || isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${isCompleted ? 'bg-[#ccd5ae]' : 'bg-neutral-200'}`} />}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">First Name <span className="text-red-400">*</span></label>
                <input type="text" {...register('firstName')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Last Name <span className="text-red-400">*</span></label>
                <input type="text" {...register('lastName')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Email Address <span className="text-red-400">*</span></label>
                <input type="email" {...register('email')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Phone Number <span className="text-red-400">*</span></label>
                <input type="text" {...register('phoneNumber')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors.phoneNumber && <p className="text-red-500 text-[10px] mt-1">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Gender <span className="text-red-400">*</span></label>
                <select {...register('gender')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employment Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Employment Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Department <span className="text-neutral-300 font-normal lowercase">(optional)</span></label>
                <select {...register('department', {
                    onChange: () => setValue('position', ''),
                  })} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer">
                  <option value="">Not assigned</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-[10px] mt-1">{errors.department.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Position / Job Title {selectedDepartmentName ? <span className="text-red-400">*</span> : <span className="text-neutral-300 font-normal lowercase">(optional)</span>}</label>
                <select {...register('position')} disabled={!selectedDepartmentName} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {!selectedDepartmentName ? (
                    <option value="">Select a department first</option>
                  ) : positionsList.length === 0 ? (
                    <option value="">No positions available</option>
                  ) : (
                    <>
                      <option value="">Select a position</option>
                      {positionsList.map((pos) => (
                        <option key={pos.id} value={pos.title}>{pos.title}</option>
                      ))}
                    </>
                  )}
                </select>
                {errors.position && <p className="text-red-500 text-[10px] mt-1">{errors.position.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Employment Type <span className="text-red-400">*</span></label>
                <select {...register('employmentType')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                  <option value="Remote">Remote</option>
                </select>
                {errors.employmentType && <p className="text-red-500 text-[10px] mt-1">{errors.employmentType.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Hire Date <span className="text-neutral-300 font-normal lowercase">(optional)</span></label>
                <input type="date" {...register('hireDate')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors.hireDate && <p className="text-red-500 text-[10px] mt-1">{errors.hireDate.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Employment Status <span className="text-neutral-300 font-normal lowercase">(optional)</span></label>
                <select {...register('status')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Probation">Probation</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </select>
                {errors.status && <p className="text-red-500 text-[10px] mt-1">{errors.status.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Review Information
            </h3>
            <div className="bg-neutral-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block">First Name</span>
                  <span className="text-neutral-900 font-bold">{watch('firstName')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Last Name</span>
                  <span className="text-neutral-900 font-bold">{watch('lastName')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Email</span>
                  <span className="text-neutral-900">{watch('email')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Phone</span>
                  <span className="text-neutral-900">{watch('phoneNumber')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Gender</span>
                  <span className="text-neutral-900">{watch('gender')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Department</span>
                  <span className="text-neutral-900">{watch('department') || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Position</span>
                  <span className="text-neutral-900">{watch('position')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Type</span>
                  <span className="text-neutral-900">{watch('employmentType')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Hire Date</span>
                  <span className="text-neutral-900">{watch('hireDate')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block">Status</span>
                  <span className="text-neutral-900">{watch('status')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 3 && (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-[#ccd5ae] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Employee Added!</h3>
            <p className="text-xs text-neutral-500">The employee has been registered successfully.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2 justify-end pt-4 border-t border-neutral-100 mt-6">
          {step < 2 && (
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          )}
          {step > 0 && step < 3 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
            >
              Back
            </button>
          )}
          {step < 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button
              type="submit"
              disabled={isCreatingEmployee}
              className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingEmployee ? (
                <><Hourglass size={14} /> Creating...</>
              ) : (
                'Create Employee'
              )}
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
