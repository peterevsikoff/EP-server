interface VerificationTokenPayload {
  token: string;
  email: string;
  purpose: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export {
    VerificationTokenPayload
}