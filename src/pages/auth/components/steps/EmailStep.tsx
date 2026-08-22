import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import { AuthInput } from '../AuthInput';

export function EmailStep() {
  const { register, formState: { errors } } = useFormContext<RegisterFormValues>();
  return (
    <AuthInput
      type="email"
      label="Email Address"
      error={errors.email?.message}
      {...register('email')}
    />
  );
}
