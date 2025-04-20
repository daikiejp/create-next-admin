import { object, string } from "zod";

export const uiLoginSchema = (t: (key: string) => string) =>
  object({
    email: string({ required_error: t("Errors.emailRequired") })
      .min(1, t("Errors.emailRequired"))
      .email(t("Errors.emailInvalid")),
    password: string({ required_error: t("Errors.passwordRequired") })
      .min(1, t("Errors.passwordRequired"))
      .min(6, t("Errors.passwordMinLength"))
      .max(32, t("Errors.passwordMaxLength")),
  });

export const uiRegisterSchema = (t: (key: string) => string) =>
  object({
    name: string({ required_error: t("Errors.nameRequired") })
      .min(1, t("Errors.nameRequired"))
      .min(3, t("Errors.nameMinLength"))
      .max(32, t("Errors.nameMaxLength")),
    email: string({ required_error: t("Errors.emailRequired") })
      .min(1, t("Errors.emailRequired"))
      .email(t("Errors.emailInvalid")),
    password: string({ required_error: t("Errors.passwordRequired") })
      .min(1, t("Errors.passwordRequired"))
      .min(6, t("Errors.passwordMinLength"))
      .max(32, t("Errors.passwordMaxLength")),
  });

export const loginSchema = object({
  email: string(),
  password: string(),
});

export const registerSchema = object({
  email: string(),
  password: string(),
  name: string(),
});
