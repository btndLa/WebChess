import * as yup from "yup";
export interface LoginRequestDto {
    userName: string;
    password: string;
}

export const loginRequestValidator = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required!"),
    password: yup.string().required("Usernameis required!"),
})