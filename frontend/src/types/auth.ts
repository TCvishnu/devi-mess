export interface LoginFormData {
	phoneNumber: string
	password: string
}

export interface LoginFormDataError {
	phoneNumber: string
	password: string
}

export interface RegisterFormData {
	fullName: string
	phoneNumber: string
	password: string
	confirmPassword: string
}

export interface RegisterFormDataError {
	fullName: string
	phoneNumber: string
	password: string
	confirmPassword: string
}
