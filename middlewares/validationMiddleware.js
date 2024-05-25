// İstek atmadan önce atılan body'in istenilen şemaya uyumlu olup olmadığını kontrol eden middleware
// Örn: İlan atılmadan önce ilanın tüm alanlarının dolu olup olmadığının kontrol edilmesi
const validationMiddleWare = (schema) => {
    return (req,res,next) => {
        const { error } = schema.validate(req.body)
        if(error) {
            console.error("Validation Error", error.message)
            res.status(400).json({
                status: "error",
                errors: error.details
            })
        }
        else {
            next();
        }
    }
}

module.exports = validationMiddleWare