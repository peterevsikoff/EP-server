import jwt from 'jsonwebtoken';

const generateVerificationToken = (email: string, purpose = "email_verification") => {
    const payload = {
        email: email,
        purpose: purpose,
        type: "verification",
        iss: "easy-psy",
        aud: "easy-psy-email-verification"
    };

    const token = jwt.sign(payload, process.env.JWT_EMAIL_SECRET || "email_verification", {
        expiresIn: "24h",
        algorithm: "HS256"
    });

    return token;
}

export {
    generateVerificationToken,
}