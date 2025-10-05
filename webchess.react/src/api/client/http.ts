import { UserInfo } from "@/contexts/UserContext";
import { HttpError } from "@/api/errors/HttpError";
import { ProblemDetails } from "@/api/models/ProblemDetails";
import { ServerSideValidationError } from "@/api/errors/ServerSideValidationError";

export async function get<TResponse>(url: string, params?: Record<string, string>): Promise<TResponse> {
    let fullUrl = `${import.meta.env.VITE_APP_API_BASEURL}/${url}`;
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        fullUrl += `?${queryString}`;
    }

    const res = await fetch(fullUrl, {
        method: "GET",
        headers: createAuthHeader()
    });
    await throwErrorIfNotOk(res);

    return await res.json();
}

export async function postAsJson<TRequest, TResponse>(url: string, body?: TRequest): Promise<TResponse> {
    console.log("ENV:", import.meta.env.VITE_APP_API_BASEURL);
    const res = await fetch(`${import.meta.env.VITE_APP_API_BASEURL}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...createAuthHeader()
        },
        body: body ? JSON.stringify(body) : undefined
    });
    await throwErrorIfNotOk(res);

    return await res.json();
}

export async function postAsJsonWithoutResponse<TRequest>(url: string, body?: TRequest): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_APP_API_BASEURL}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...createAuthHeader()
        },
        body: body ? JSON.stringify(body) : undefined
    });
    await throwErrorIfNotOk(res);
}

export async function deleteResource(url: string){
    const res = await fetch(`${import.meta.env.VITE_APP_API_BASEURL}/${url}`, {
        method: "DELETE",
        headers: createAuthHeader()
    });
    await throwErrorIfNotOk(res);
}

function createAuthHeader() {
    const userSessionItem = localStorage.getItem('user');
    if (!userSessionItem) {
        return undefined;
    }

    const user = JSON.parse(userSessionItem) as UserInfo;
    return {
        "Authorization": `Bearer ${user.authToken}`
    };
}

async function throwErrorIfNotOk(res: Response) {
    if (res.ok) {
        return;
    }

    let responseObject;
    try {
        responseObject = await res.json();
    } catch {
        throw new Error(`Request failed with status ${res.status} (${res.statusText})`);
    }

    if (!responseObject?.title) {
        throw new HttpError(res.status, `Request failed with status ${res.status} (${res.statusText})`);
    }

    const problemDetails = responseObject as ProblemDetails;
    if (res.status === 400 && problemDetails.errors) {
        const validationErrords: Record<string, string> = Object.create(null);
        for (const fieldName in problemDetails.errors) {
            const fieldNameCamelCase = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
            validationErrords[fieldNameCamelCase] = problemDetails.errors[fieldName][0];
        }

        throw new ServerSideValidationError(problemDetails.status, problemDetails.title, validationErrords);
    }

    const message = problemDetails.detail ? `${problemDetails.title} - ${problemDetails.detail}` : problemDetails.title;
    throw new HttpError(problemDetails.status, message);
}