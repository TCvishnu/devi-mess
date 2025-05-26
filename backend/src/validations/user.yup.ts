import * as yup from "yup"

export const RegisterRequest = yup
	.object()
	.shape({
		name: yup.string().trim().required("name is required"),
		phoneNumber: yup
			.string()
			.required("phoneNumber is required")
			.length(10),
		password: yup.string().required("password is required"),
	})
	.stripUnknown()

export const LoginRequest = yup
	.object()
	.shape({
		phoneNumber: yup
			.string()
			.required("phoneNumber is required")
			.length(10),
		password: yup.string().required("password is required"),
	})
	.stripUnknown()
