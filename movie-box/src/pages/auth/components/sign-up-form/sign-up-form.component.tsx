import { ReactElement, useState } from "react";

import { Link, useNavigate } from "react-router";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";

import { fetchSignUpApi } from "../../../../api/fetch-sign-up.api.ts";

import ButtonComponent from "../../../../components/button/button.component.tsx";
import PasswordInputComponent from "../../../../components/password-input/password-input.component.tsx";

import { ValidationErrors } from "../../../../dto/response.dto.ts";
import { SignUpDto, signUpSchema } from "../../../../dto/sign-up.dto.ts";

import styles from "../../styles/auth-form.module.css";
import FormTextInputComponent from '../../../../components/form-text-input/form-text-input.component.tsx';

export default function SignUpFormComponent(): ReactElement {
  const navigate = useNavigate();

  const [serverErrors, setServerErrors] =
    useState<ValidationErrors<SignUpDto>>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: fetchSignUpApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const formSubmitHandler: SubmitHandler<SignUpDto> = (data): void => {
    mutation.mutate(data, {
      onSuccess: (result) => {
        if ("error" in result) {
          setServerErrors(result.validationErrors);
          toast.error(result.message);
        } else {
          toast.success(result.message);
          navigate("/dashboard");
        }
      },
    });
  };

  return (
    <div className={styles["auth-form"]}>
      <h1>Sign Up!</h1>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <FormTextInputComponent
              label="Username"
              clientError={clientErrors?.username}
              serverErrors={serverErrors?.username}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInputComponent
              label="Password"
              autoComplete="new-password"
              clientError={clientErrors?.password}
              serverErrors={serverErrors?.password}
              {...field}
            />
          )}
        />
        <ButtonComponent>Sign Up</ButtonComponent>
      </form>
      <div className={styles["change-form"]}>
        Already have an account? <Link to="/auth/sign-in">Sign in</Link>.
      </div>
    </div>
  );
}
