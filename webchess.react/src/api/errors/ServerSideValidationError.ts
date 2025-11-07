import { HttpError } from "./HttpError";

export class ServerSideValidationError extends HttpError {
    private readonly validationErrors: Record<string, string>;

    constructor(status: number, message: string, validationErrors: Record<string, string>) {
        super(status, message);
        this.validationErrors = validationErrors;
    }
}
