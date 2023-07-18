
export function localvariable(req,res,next)
{
    req.app.locals={
        OTP : null,
        ResetSession : false,
    }
    next();
}