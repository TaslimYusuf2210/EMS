import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import hrRepSvg from '../../assets/hr_rep.svg';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { useSendOtp } from '../../hooks/useMutation/useSendOtp';
import { useVerifyOtp } from '../../hooks/useMutation/useVerifyOtp';
import { useRegisterAccount } from '../../hooks/useMutation/useRegisterAccount';

import { registerSchema, type RegisterFormValues, STEPS, stepMessages } from './schemas/registerSchema';
import { Stepper } from './components/Stepper';
import { EmailStep } from './components/steps/EmailStep';
import { OtpStep } from './components/steps/OtpStep';
import { CompanyInfoStep } from './components/steps/CompanyInfoStep';
import { PasswordStep } from './components/steps/PasswordStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { SuccessStep } from './components/steps/SuccessStep';

// ─── Main Component ──────────────────────────────────────────────────

export default function CreateAccount() {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const { mutateAsync: handleSendOtp, isPending: isSendingOtp } = useSendOtp({
    onSuccess: () => {
      setStep(1);
      setCompletedSteps((prev) => new Set(prev).add(0));
    },
  });

  const { mutateAsync: handleVerifyOtp, isPending: isVerifyingOtp } = useVerifyOtp({
    onSuccess: () => {
      setStep(2);
      setCompletedSteps((prev) => new Set(prev).add(1));
    },
  });

  const { mutateAsync: registerUser, isPending } = useRegisterAccount({
    onSuccess: () => {
      setStep(5);
      setCompletedSteps((prev) => new Set(prev).add(4));
    },
  });

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      email: '',
      otp: '',
      phoneNumber: '',
      state: '',
      lga: '',
      settlement: '',
      streetAddress: '',
      description: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const isLastStep = step === 4;
  const isSuccessStep = step === 5;

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= step || completedSteps.has(targetStep - 1)) {
      setStep(targetStep);
    }
  };

  const handleNext = async () => {
    // On review step, validate ALL fields across every step
    const fields = (step === 4
      ? ['email', 'otp', 'companyName', 'description', 'phoneNumber', 'state', 'lga', 'settlement', 'streetAddress', 'password', 'confirmPassword', 'agreeTerms']
      : STEPS[step].fields) as unknown as Parameters<typeof methods.trigger>[0];

    const isValid = await methods.trigger(fields);
    if (!isValid) return;

    const newCompleted = new Set(completedSteps).add(step);
    setCompletedSteps(newCompleted);

    if (step === 0) {
      await handleSendOtp({ email: methods.getValues('email') });
      return;
    }

    if (step === 1) {
      await handleVerifyOtp({
        email: methods.getValues('email'),
        otp: methods.getValues('otp'),
      });
      return;
    }

    if (step === 4) {
      const data = methods.getValues();
      const payload = {
        companyName: data.companyName,
        email: data.email,
        phone: data.phoneNumber,
        address: {
          state: data.state,
          lga: data.lga,
          settlement: data.settlement,
          street: data.streetAddress,
        },
        description: data.description,
        password: data.password,
        agreeTerms: data.agreeTerms,
      };
      try {
        await registerUser(payload);
      } catch {
        // handled by mutation onError
      }
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="flex h-screen">
      {/* Left column: SVG Illustration */}
      <div className="hidden md:flex w-1/2 bg-indigo-50/50 p-8 md:pr-6 lg:pr-16 flex-col items-center justify-center relative overflow-hidden border-r border-slate-100">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#faedcd] flex items-center justify-center text-neutral-950 font-bold text-lg">S</div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">StaffSync</span>
        </div>
        <div className="w-full max-w-sm aspect-square flex items-center justify-center mt-8">
          <img src={hrRepSvg} alt="HR Representative Illustration"
            className="w-full h-auto object-contain animate-fade-in hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="mt-8 text-center hidden md:block">
          <h3 className="font-semibold text-slate-800 text-lg">{stepMessages[step].heading}</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">{stepMessages[step].subtext}</p>
        </div>
      </div>

      {/* Right column: Form */}
      <div className="w-full md:w-1/2 p-8 sm:p-4 md:py-16 md:pr-6 md:pl-10 lg:pr-12 lg:pl-20 flex flex-col overflow-y-auto">
        <div className="m-auto w-full sm:w-[75%] md:flex-1 md:m-0 md:w-full sm:bg-white md:bg-transparent rounded-none sm:rounded-3xl md:rounded-none shadow-none sm:shadow-xl md:shadow-none px-0 sm:px-6 md:px-0 py-0 sm:py-10 md:py-0">
          {!isSuccessStep && (
            <>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Join us,</h2>
              <h1 className="text-4xl font-extrabold text-indigo-950 tracking-tight mb-8">Create account</h1>
            </>
          )}

          {!isSuccessStep && (
            <Stepper steps={STEPS} currentStep={step} completedSteps={completedSteps} onStepClick={handleStepClick} />
          )}

          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {step === 0 && <EmailStep />}
              {step === 1 && <OtpStep />}
              {step === 2 && <CompanyInfoStep />}
              {step === 3 && <PasswordStep />}
              {step === 4 && <ReviewStep />}
              {step === 5 && <SuccessStep />}

              {!isSuccessStep && (
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={handleBack} disabled={step === 0}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Back
                  </button>
                  <button type="button" onClick={handleNext} disabled={isPending || isSendingOtp || isVerifyingOtp}
                    className="btn-brand px-6 py-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {step === 0 && isSendingOtp ? <Hourglass size="18" color="white" /> : step === 1 && isVerifyingOtp ? <Hourglass size="18" color="white" /> : isLastStep && isPending ? <Hourglass size="18" color="white" /> : isLastStep ? 'Create Account' : 'Next →'}
                  </button>
                </div>
              )}
            </form>
          </FormProvider>

          {!isSuccessStep && (
            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-deep hover:text-brand font-bold hover:underline">Click here</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
