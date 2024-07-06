const Product =  require("../models/productModel");
const ErrorHander = require("../utlis/errorhander")
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utlis/apifeatures");



exports.createProduct = catchAsyncError(async ( req,res,next) => {

    req.body.user = req.user.id; 

    const products = await Product.create(req.body);

    res.status(201).json({
        success:true,
        products
    })

})



exports.getAllProducts = catchAsyncError(async(req,res) => {


    const resultPerPage = 5;
    const productsCount = await Product.countDocuments();

    const apifeature= new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const product = await apifeature.query;

    res.status(200).json({
        success:true,
        product
    })
})



exports.getProductDetails = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }


    
    res.status(200).json({
        sucess:true,
        product,
        productsCount
    })

})



exports.updateProduct = catchAsyncError(async (req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
})


exports.deleteProduct = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        sucess:true,
        message:"Product Delete Succesfully"
    })

})