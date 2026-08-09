import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";

dotenv.config();

const BASE_URL = "https://res.cloudinary.com/dyg6tlb2r/image/upload/";

const products = [
  {
    _id: "aaaaa",
    name: "Aria Floral Off-Shoulder Top",
    description:
      "Bring a touch of elegance to your casual wardrobe with this breezy floral off-shoulder top. Lightweight and breathable, it is designed to keep you cool and stylish on warm sunny days.",
    price: 100,
    image: [BASE_URL + "v1786017676/p_img1_mfjckj.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },

  {
    _id: "aaaab",
    name: "Vanguard Pink Classic Polo",
    description:
      "A refined staple crafted from premium cotton, offering a comfortable fit, a classic collar, and a timeless look for smart-casual occasions.",
    price: 200,
    image: [
      BASE_URL + "v1786017695/p_img2_1_lamlh9.png",
      BASE_URL + "v1786017695/p_img2_2_v7e00t.png",
      BASE_URL + "v1786017696/p_img2_3_z52atg.png",
      BASE_URL + "v1786017698/p_img2_4_ojnbgr.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621345448,
    bestseller: true,
  },

  {
    _id: "aaaac",
    name: "Daisy Floral Puff-Sleeve Dress",
    description:
      "A charming and lightweight dress featuring delightful floral prints and playful puff sleeves, perfect for parties, family gatherings, or sunny days out.",
    price: 220,
    image: [BASE_URL + "v1786017698/p_img3_ezbukq.png"],
    category: "Kids",
    subCategory: "Dresses",
    sizes: ["S", "L", "XL"],
    date: 1716234345448,
    bestseller: true,
  },

  {
    _id: "aaaad",
    name: "Apex Obsidian Streetwear Tee",
    description:
      "Level up your streetwear game with this premium cotton graphic tee. Features a modern slim-fit design and bold Puma branding for casual outings.",
    price: 150,
    image: [BASE_URL + "v1786017708/p_img4_r6fmbz.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },

  {
    _id: "aaaae",
    name: "Nova Athletic Logo Tee",
    description:
      "A sleek blend of athletic style and everyday comfort. This classic black tee features the iconic Puma logo, crafted from soft, breathable cotton for an effortless street-smart look.",
    price: 130,
    image: [BASE_URL + "v1786017717/p_img5_op4knk.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716622345448,
    bestseller: true,
  },

  {
    _id: "aaaaf",
    name: "Mimi Rose Ribbed Everyday Tee",
    description:
      "Soft, stretchy, and adorable. This pink ribbed t-shirt offers everyday comfort and cute styling for active little ones.",
    price: 140,
    image: [BASE_URL + "v1786017720/p_img6_unyrvq.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    date: 1716623423448,
    bestseller: true,
  },

  {
    _id: "aaaag",
    name: "Sterling Tailored Tapered Trousers",
    description:
      "Tailored for a modern silhouette, these navy blue tapered trousers deliver a sharp, polished look without compromising on all-day comfort.",
    price: 190,
    image: [BASE_URL + "v1786017721/p_img7_td0hdq.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716621542448,
    bestseller: false,
  },

  {
    _id: "aaaah",
    name: "Harbor Striped Long-Sleeve Polo",
    description:
      "A stylish twist on a classic design, this long-sleeve striped polo brings warmth and timeless preppy style to your cooler-weather wardrobe.",
    price: 140,
    image: [BASE_URL + "v1786017721/p_img8_og6hk3.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716622345448,
    bestseller: false,
  },

  {
    _id: "aaaai",
    name: "Toby Sweet Heart Print Tee",
    description:
      "Sweet and playful, this blue heart-print top is crafted from soft, skin-friendly fabric designed to keep kids comfortable all day long.",
    price: 100,
    image: [BASE_URL + "v1786017722/p_img9_kvxlly.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716621235448,
    bestseller: false,
  },

  {
    _id: "aaaaj",
    name: "Nomad Utility Cargo Joggers",
    description:
      "The ultimate combination of utility and comfort. These grey cargo joggers feature practical pockets and a relaxed fit for active, everyday wear.",
    price: 110,
    image: [BASE_URL + "v1786017676/p_img10_tyoiqr.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    date: 1716622235448,
    bestseller: false,
  },

  {
    _id: "aaaak",
    name: "Stride Athletic Raglan Tee",
    description:
      "Designed for freedom of movement, this raglan sleeve t-shirt offers a sporty edge and a comfortable fit for your casual daily routines.",
    price: 120,
    image: [BASE_URL + "v1786017677/p_img11_rntcmq.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716623345448,
    bestseller: false,
  },
  {
    _id: "aaaal",
    name: "Essential Cotton Crew Tee",
    description:
      "An absolute wardrobe essential. This clean white crew neck tee is crafted from ultra-soft cotton, perfect for layering or wearing solo.",
    price: 150,
    image: [BASE_URL + "v1786017678/p_img12_y3yz0t.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716624445448,
    bestseller: false,
  },
  {
    _id: "aaaam",
    name: "Celeste Office-Casual Collared Top",
    description:
      "Smart meets casual in this chic light blue collared top. Perfect for office-casual days or weekend brunches, it offers a refined silhouette with effortless wearability.",
    price: 130,
    image: [BASE_URL + "v1786017679/p_img13_mmjnre.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716625545448,
    bestseller: false,
  },
  {
    _id: "aaaan",
    name: "Leo Breeze Short-Sleeve Shirt",
    description:
      "A crisp and breezy short-sleeve shirt in a lovely shade of blue, ideal for family events or smart-casual daily wear.",
    price: 160,
    image: [BASE_URL + "v1786017680/p_img14_hfd83s.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716626645448,
    bestseller: false,
  },
  {
    _id: "aaaao",
    name: "Pulse Athletic Track Pants",
    description:
      "Whether you are hitting the gym or lounging at home, these navy blue track pants offer supreme comfort, flexibility, and a sleek athletic fit.",
    price: 140,
    image: [BASE_URL + "v1786017681/p_img15_sbwt3m.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716627745448,
    bestseller: false,
  },
  {
    _id: "aaaap",
    name: "Lily Puff-Sleeve Ribbed Blouse",
    description:
      "Combining classic comfort with trendy puff sleeves, this white ribbed top is a versatile piece every young fashionista needs.",
    price: 170,
    image: [BASE_URL + "v1786017682/p_img16_wpwl81.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716628845448,
    bestseller: false,
  },
  {
    _id: "aaaaq",
    name: "Velocity Track Joggers",
    description:
      "Sleek and versatile, these black track pants are built for maximum comfort and mobility, featuring an adjustable waistband for a secure fit.",
    price: 150,
    image: [BASE_URL + "v1786017683/p_img17_eocybx.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716629945448,
    bestseller: false,
  },
  {
    _id: "aaaar",
    name: "Kian Playtime Graphic Tee",
    description:
      "Fun, playful, and easy to wear, this white graphic t-shirt is built from soft cotton to keep up with everyday adventures.",
    price: 180,
    image: [BASE_URL + "v1786017683/p_img18_qihbab.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716631045448,
    bestseller: false,
  },
  {
    _id: "aaaas",
    name: "Skyline Adventure Graphic Tee",
    description:
      "A cool and colorful graphic tee designed to give active boys maximum comfort and style throughout their day.",
    price: 160,
    image: [BASE_URL + "v1786017685/p_img19_seugcl.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716632145448,
    bestseller: false,
  },
  {
    _id: "aaaat",
    name: "Luna Belted Flowing Palazzo Pants",
    description:
      "Elevate your comfort with these flowing palazzo pants, complete with a matching waist belt to define your silhouette. Designed for effortless movement and timeless elegance.",
    price: 190,
    image: [BASE_URL + "v1786017686/p_img20_wrw62p.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716633245448,
    bestseller: false,
  },

  {
    _id: "aaaau",
    name: "Zenith Relaxed Zip-Front Jacket",
    description:
      "Stay cozy and chic with this relaxed-fit zip-front jacket. An essential layering piece that combines modern utility with everyday casual style.",
    price: 170,
    image: [BASE_URL + "v1786017687/p_img21_ifxyso.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "aaaav",
    name: "Solstice Wide-Leg Striped Palazzos",
    description:
      "Make a statement with these eye-catching striped palazzo pants. Their wide-leg cut and breathable fabric ensure maximum comfort while turning heads wherever you go.",
    price: 200,
    image: [BASE_URL + "v1786017688/p_img22_hrddig.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716635445448,
    bestseller: false,
  },
  {
    _id: "aaaaw",
    name: "Fern Forest Adventure Tee",
    description:
      "Vibrant and fun, this green graphic t-shirt brings a splash of color and casual comfort to your child's wardrobe.",
    price: 180,
    image: [BASE_URL + "v1786017689/p_img23_zughbc.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716636545448,
    bestseller: false,
  },
  {
    _id: "aaaax",
    name: "Sunny Citrus Kids Graphic Tee",
    description:
      "Bright as sunshine, this yellow graphic t-shirt is made for active play and everyday casual comfort.",
    price: 210,
    image: [BASE_URL + "v1786017690/p_img24_a6eojj.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716637645448,
    bestseller: false,
  },
  {
    _id: "aaaay",
    name: "Mia Blossom Floral Top",
    description:
      "A dainty white floral top that brings a fresh, cheerful vibe to any young girl's casual outfit collection.",
    price: 190,
    image: [BASE_URL + "v1786017691/p_img25_c5hxvh.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716638745448,
    bestseller: false,
  },
  {
    _id: "aaaaz",
    name: "Midnight Modern Zip-Front Jacket",
    description:
      "A versatile outerwear staple, this black zip-front jacket offers a sleek, modern look while keeping you warm during chilly days and crisp evenings.",
    price: 220,
    image: [BASE_URL + "v1786017691/p_img26_sm54a9.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716639845448,
    bestseller: false,
  },
  {
    _id: "aaaba",
    name: "Rosie Sweet Meadow Top",
    description:
      "Pretty in pink! This delightful floral top combines soft fabrics with a cute pattern designed for everyday smiles.",
    price: 200,
    image: [BASE_URL + "v1786017692/p_img27_tt5qd1.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716640945448,
    bestseller: false,
  },
  {
    _id: "aaabb",
    name: "Rogue Slim-Fit Relaxed Denim Jacket",
    description:
      "The ultimate layering essential. This denim jacket combines a structured slim fit with relaxed wearability, making it a timeless addition to any wardrobe.",
    price: 230,
    image: [BASE_URL + "v1786017693/p_img28_gs54ql.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716642045448,
    bestseller: false,
  },
  {
    _id: "aaabc",
    name: "Bianca Ivory Floral Blouse",
    description:
      "Bright and cheerful, this white floral top adds a delicate, feminine touch to your daily rotation. Pair it effortlessly with your favorite jeans or skirts.",
    price: 210,
    image: [BASE_URL + "v1786017694/p_img29_lnluzp.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716643145448,
    bestseller: false,
  },
  {
    _id: "aaabd",
    name: "Chloe Azure Garden Top",
    description:
      "Refreshing and cute, this blue floral top offers lightweight breathability and effortless style for warm weather.",
    price: 240,
    image: [BASE_URL + "v1786017699/p_img30_px9d4z.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716644245448,
    bestseller: false,
  },

  {
    _id: "aaabe",
    name: "Matrix Urban Graphic Tee",
    description:
      "Add attitude to your casual look with this sharp black graphic t-shirt, made from soft, durable cotton for everyday wear.",
    price: 220,
    image: [BASE_URL + "v1786017699/p_img31_glcit9.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716645345448,
    bestseller: false,
  },
  {
    _id: "aaabf",
    name: "Polaris Crisp Minimalist Tee",
    description:
      "Keep it fresh and casual with this eye-catching white graphic t-shirt, designed for effortless style and breathable comfort.",
    price: 250,
    image: [BASE_URL + "v1786017701/p_img32_zqo7xr.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716646445448,
    bestseller: false,
  },
  {
    _id: "aaabg",
    name: "Honey Sunbeam Floral Top",
    description:
      "Cheerful floral prints make this yellow top an instant favorite for playdates, school, or weekend outings.",
    price: 230,
    image: [BASE_URL + "v1786017702/p_img33_bqwpee.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716647545448,
    bestseller: false,
  },
  {
    _id: "aaabh",
    name: "Verde Botanical Wrap Top",
    description:
      "Infuse natural charm into your style with this vibrant green floral top. Lightweight and comfortable, it is designed to transition seamlessly from day to night.",
    price: 260,
    image: [BASE_URL + "v1786017703/p_img34_ehy0h5.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716648645448,
    bestseller: false,
  },
  {
    _id: "aaabi",
    name: "Ash Urban Zip-Front Jacket",
    description:
      "Minimalist and functional, this grey zip-front jacket is your go-to layer for casual outings, offering a comfortable fit and effortless style.",
    price: 240,
    image: [BASE_URL + "v1786017704/p_img35_iwtiun.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716649745448,
    bestseller: false,
  },
  {
    _id: "aaabj",
    name: "Azure Breeze Zip-Front Jacket",
    description:
      "Add a pop of cool color to your outer layers with this stylish blue zip-front jacket, built for everyday warmth and effortless versatility.",
    price: 270,
    image: [BASE_URL + "v1786017705/p_img36_q2ili5.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716650845448,
    bestseller: false,
  },
  {
    _id: "aaabk",
    name: "Ruby Crimson Floral Top",
    description:
      "Make a bold, vibrant impression with this striking red floral top. Designed with lightweight fabric for a comfortable, flattering fit all day long.",
    price: 250,
    image: [BASE_URL + "v1786017705/p_img37_fqctry.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716651945448,
    bestseller: false,
  },
  {
    _id: "aaabl",
    name: "Carbon Grey Everyday Graphic Tee",
    description:
      "A versatile everyday staple, this grey graphic t-shirt pairs easily with jeans or joggers for a laid-back, modern aesthetic.",
    price: 280,
    image: [BASE_URL + "v1786017706/p_img38_xcewlm.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716653045448,
    bestseller: false,
  },
  {
    _id: "aaabm",
    name: "Oxford Print-Pattern Cotton Shirt",
    description:
      "Smart, subtle, and breathable. This printed cotton shirt offers a polished look that works seamlessly for both office wear and weekend outings.",
    price: 260,
    image: [BASE_URL + "v1786017707/p_img39_isb4ww.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716654145448,
    bestseller: false,
  },
  {
    _id: "aaabn",
    name: "Cobalt Modern Slim Denim Jacket",
    description:
      "A classic rugged staple updated with a modern slim fit. This blue denim jacket adds instant cool to any casual outfit.",
    price: 290,
    image: [BASE_URL + "v1786017709/p_img40_judrky.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716655245448,
    bestseller: false,
  },

  {
    _id: "aaabo",
    name: "Cobalt Graphic Street Tee",
    description:
      "Brighten up your casual rotation with this vibrant blue graphic t-shirt, crafted from soft cotton for all-day ease.",
    price: 270,
    image: [BASE_URL + "v1786017710/p_img41_qjzeod.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716656345448,
    bestseller: false,
  },
  {
    _id: "aaabp",
    name: "Blaze Kids Red Action Tee",
    description:
      "Bold and energetic, this red graphic t-shirt is crafted for durability and soft, everyday comfort.",
    price: 300,
    image: [BASE_URL + "v1786017711/p_img42_zmfsjj.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716657445448,
    bestseller: false,
  },
  {
    _id: "aaabq",
    name: "Titan Kids Slate Tapered Trousers",
    description:
      "Smart and flexible, these grey tapered trousers offer a neat look while letting kids run, play, and move with ease.",
    price: 280,
    image: [BASE_URL + "v1786017712/p_img43_cdrwyt.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716658545448,
    bestseller: false,
  },
  {
    _id: "aaabr",
    name: "Scarlet Bold Zip-Front Jacket",
    description:
      "Stand out in any crowd with this bold red zip-front jacket. Combines cozy warmth with an energetic, fashion-forward aesthetic.",
    price: 310,
    image: [BASE_URL + "v1786017713/p_img44_c6ms9w.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716659645448,
    bestseller: false,
  },
  {
    _id: "aaabs",
    name: "Onyx Slim-Fit Biker Denim Jacket",
    description:
      "Edgy, versatile, and timeless. This black slim-fit denim jacket is an essential outer layer designed to elevate your everyday style.",
    price: 290,
    image: [BASE_URL + "v1786017714/p_img45_bnbx8p.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716660745448,
    bestseller: false,
  },
  {
    _id: "aaabt",
    name: "Smoke Grey Slim Denim Jacket",
    description:
      "A contemporary take on classic outerwear, this grey slim-fit denim jacket offers a unique neutral tone that pairs with almost anything.",
    price: 320,
    image: [BASE_URL + "v1786017715/p_img46_ikrnl4.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716661845448,
    bestseller: false,
  },
  {
    _id: "aaabu",
    name: "Ocean Kids Tapered Denim Trousers",
    description:
      "Stylish and practical, these blue tapered trousers combine a modern slim fit with durable comfort for active kids.",
    price: 300,
    image: [BASE_URL + "v1786017716/p_img47_k7t2r4.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716662945448,
    bestseller: false,
  },
  {
    _id: "aaabv",
    name: "Frost White Slim Denim Jacket",
    description:
      "Make a bold fashion statement with this clean white slim-fit denim jacket, perfect for adding a sharp, modern edge to your wardrobe.",
    price: 330,
    image: [BASE_URL + "v1786017717/p_img48_mdrm4u.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716664045448,
    bestseller: false,
  },
  {
    _id: "aaabw",
    name: "Forest Kids Olive Tapered Trousers",
    description:
      "A fun pop of color for kids' bottoms, these green tapered trousers offer a comfortable fit for school or play.",
    price: 310,
    image: [BASE_URL + "v1786017717/p_img49_slrrsi.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716665145448,
    bestseller: false,
  },
  {
    _id: "aaabx",
    name: "Amber Kids Sunshine Trousers",
    description:
      "Bright and cheerful trousers featuring a comfortable tapered fit, designed to keep up with your child's daily adventures.",
    price: 340,
    image: [BASE_URL + "v1786017718/p_img50_w4ajgz.png"],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716666245448,
    bestseller: false,
  },
  {
    _id: "aaaby",
    name: "Ivory Snowfall Zip-Front Jacket",
    description:
      "Clean, crisp, and versatile, this white zip-front jacket provides an effortless layering option to brighten up your cool-weather wardrobe.",
    price: 320,
    image: [BASE_URL + "v1786017719/p_img51_gxkttk.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716667345448,
    bestseller: false,
  },
  {
    _id: "aaabz",
    name: "Rust Heritage Slim Denim Jacket",
    description:
      "Rich in tone and rugged in style, this brown slim-fit denim jacket provides a distinct, earthy alternative to traditional denim outerwear.",
    price: 350,
    image: [BASE_URL + "v1786017719/p_img52_oiphfu.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716668445448,
    bestseller: false,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    await productModel.deleteMany({});
    console.log("Old products deleted");

    await productModel.insertMany(products);
    console.log(`✅ ${products.length} Products seeded successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seedDB();
