import product from "../models/ProductModels.js";
import path from "path"
import fs from "fs"

export const getProduct = async (req,res) => {
    try {
        const response = await product.findAll()
        res.json(response);
        
    } catch (error) {
        console.log(error.message);
    }
}
export const getProductById = async (req,res) => {
    try {
        const response = await product.findOne({
            where: {
                id:req.params.id
            }
        })
        if(!response) return res.status(404).json({msg:"data tidak ditemukan"});

        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
export const saveProduct = async (req,res) => {
    if(req.files === null) return res.status(400).json({msg:"no file uploaded"})
    const name = req.body.title,
    file = req.files.file,//menangkap file nya
    fileSize = file.size,
    fileExt = path.extname(file.name),//menangkap extension dari file nya(jpeg,png,jpg,dll);
    fileName =file.md5 + fileExt,//md5 membuat nama file menjadi string acak  
    url = `${req.protocol}://${req.get("host")}/images/${fileName}`,
    allowType = [".png",".jpg",".jpeg"];//ext yang di izinkan

    if (!allowType.includes(fileExt.toLowerCase())) return res.status(400).json({msg:"ext file harus png/jpg/jpeg"})

    if(fileSize > 5000000) return res.status(400).json({msg:"ukuran file harus lebih kecil dari 5mb"});//5jt == 5mb

    file.mv(`./public/images/${fileName}`,async (error) => {//mengopload ke folder/tempat yang sudah di tentukan
        if(error) return res.status(500).json({msg:error.message})
        try {
            await product.create({
                nama:name,
                image:fileName,
                url:url
            })

            res.status(201).json({msg:"product berhasil di upload"});

        } catch (error) {
            console.log(error.message)
        }
    })
    
}


export const updateProduct = async (req,res) => {
    let url;
   const response = await product.findAll({
    where :{
        id:req.params.id
    }
   })

   if(!response) return res.status(404).json({msg:"data tidak ditemukan"})
   let fileName =""
   if(req.files === null) {
    // jika user tidak mengirim gambar,berrti user hanya mengupdate nama product nya
    fileName = response[0].image;
   }else {

    const file = req.files.file; //menangkap file nya
    const fileSize = file.size,
    fileExt = path.extname(file.name),//menangkap extension dari file nya(jpeg,png,jpg,dll);
    allowType = [".png",".jpg",".jpeg"];//ext yang di izinkan
    fileName =file.md5 + fileExt;//md5 membuat nama file menjadi string acak fileName variable let
    url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    console.log(fileExt)
    if (!allowType.includes(fileExt.toLowerCase())) return res.status(400).json({msg:"ext file harus png/jpg/jpeg"})

    if(fileSize > 5000000) return res.status(400).json({msg:"ukuran file harus lebih kecil dari 5mb"});//5jt == 5mb

    fs.unlinkSync(`./public/images/${response[0].image}`);
    file.mv(`./public/images/${fileName}`,error => {
        res.status(400).json({msg:error})
    }) 
   }

   try {
    await product.update({
        nama:req.body.title,
        image:fileName,
        url : url
       },{
        where:{
            id:req.params.id
        }
       })
    
       res.status(200).json({msg:"product berhasil di update"});
   } catch (error) {
    console.log(error.message);
   }
   
}


export const deleteProduct = async (req,res) => {
    // dapatkan dulu data berdasarkan id yang dikirim di parameter
    const response = await product.findOne({
        where:{
            id:req.params.id
        }
    })
    if(!response) return res.status(400).json({msg:"data tidak ditemukan"});

    try {
        // sebelum hapus di database,di hapus dulu di folder image nya;
        fs.unlinkSync(`./public/images/${response.image}`);

        await product.destroy({
            where:{
                id:req.params.id
            }
        })

        res.status(200).json({msg:"product berhasil di hapus"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
}