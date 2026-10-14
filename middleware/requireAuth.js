
export async function requireAuth(req, res, next){
    if(!req?.session?.userID){
        return res.status(401).json({error: 'Unauthorized User'})
    }

    next()
}