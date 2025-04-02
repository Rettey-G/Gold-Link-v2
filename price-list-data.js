const priceListData = [
    // Mushrooms
    { id: 1, image: 'images/orinji-mushroom.jpg', name: 'Orinji Mushroom', thaiName: 'เห็ดออรินจิ', category: 'mushroom', price: 4.50, unit: 'kg' },
    { id: 2, image: 'images/button-mushroom.jpg', name: 'Button Mushroom', thaiName: 'เห็ดแชมปิญอง/เห็ดกระดุมน้ำตาล', category: 'mushroom', price: 5.20, unit: 'kg' },
    { id: 3, image: 'images/shitake-mushroom.jpg', name: 'Shitake Mushroom', thaiName: 'เห็ดหอมสด', category: 'mushroom', price: 7.80, unit: 'kg' },
    { id: 4, image: 'images/straw-mushroom.jpg', name: 'Straw Mushroom', thaiName: 'เห็ดฟาง', category: 'mushroom', price: 6.20, unit: 'kg' },
    { id: 5, image: 'images/jelly-mushroom.jpg', name: 'Jelly Mushroom', thaiName: 'เห็ดหูหนู', category: 'mushroom', price: 5.50, unit: 'kg' },
    { id: 6, image: 'images/oyster-mushroom.jpg', name: 'Oyster Mushroom', thaiName: 'เห็ดนางรม / เห็ดนางฟ้า', category: 'mushroom', price: 4.80, unit: 'kg' },
    { id: 7, image: 'images/enoki-mushroom.jpg', name: 'Enoki Mushroom', thaiName: 'เห็ดเข็มทอง', category: 'mushroom', price: 6.50, unit: 'kg' },
    { id: 8, image: 'images/shimeji-mushroom.jpg', name: 'Shimeji Mushroom', thaiName: 'เห็ดชิเมจิน้ำตาล', category: 'mushroom', price: 7.20, unit: 'kg' },
    { id: 9, image: 'images/white-shimeji.jpg', name: 'White Shimeji Mushroom', thaiName: 'เห็ดชิเมจิขาว', category: 'mushroom', price: 7.50, unit: 'kg' },
    { id: 10, image: 'images/protobello.jpg', name: 'Protobello Mushroom', thaiName: 'เห็ดแชมปิญอง', category: 'mushroom', price: 8.00, unit: 'kg' },

    // Herbs
    { id: 11, image: 'images/sweet-basil.jpg', name: 'Sweet Basil', thaiName: 'โหระพา', category: 'herb', price: 2.30, unit: 'bunch' },
    { id: 12, image: 'images/holy-basil.jpg', name: 'Holy Hot Basil', thaiName: 'กะเพรา', category: 'herb', price: 2.10, unit: 'bunch' },
    { id: 13, image: 'images/hairy-basil.jpg', name: 'Hairy Basil Leaf', thaiName: 'ใบแมงลัก', category: 'herb', price: 2.20, unit: 'bunch' },
    { id: 14, image: 'images/red-basil.jpg', name: 'Red Hot Basil', thaiName: 'กะเพราแดง', category: 'herb', price: 2.40, unit: 'bunch' },
    { id: 15, image: 'images/italian-basil.jpg', name: 'Italian Basil', thaiName: 'โหระพาอิตาเลี่ยน', category: 'herb', price: 2.60, unit: 'bunch' },
    { id: 16, image: 'images/vietnamese-basil.jpg', name: 'Vietnamese Basil', thaiName: 'ผักแพว', category: 'herb', price: 2.30, unit: 'bunch' },
    { id: 17, image: 'images/thai-parsley.jpg', name: 'Thai Parsley', thaiName: 'ผักชีฝรั่ง', category: 'herb', price: 1.80, unit: 'bunch' },
    { id: 18, image: 'images/english-parsley.jpg', name: 'English Parsley', thaiName: 'พาสลีย์', category: 'herb', price: 2.00, unit: 'bunch' },
    { id: 19, image: 'images/italian-parsley.jpg', name: 'Italian Parsley', thaiName: 'พาสลีย์ อิตาเลี่ยน', category: 'herb', price: 2.20, unit: 'bunch' },
    { id: 20, image: 'images/kaffir-lime.jpg', name: 'Kaffir Lime Leaf', thaiName: 'ใบมะกรูด', category: 'herb', price: 1.50, unit: 'bunch' },
    { id: 21, image: 'images/rosemary.jpg', name: 'Rosemary', thaiName: 'โรสแมรี่', category: 'herb', price: 2.80, unit: 'bunch' },
    { id: 22, image: 'images/dill.jpg', name: 'Dill', thaiName: 'ผักชีลาว', category: 'herb', price: 2.10, unit: 'bunch' },
    { id: 23, image: 'images/coriander.jpg', name: 'Coriander', thaiName: 'ผักชีไทย', category: 'herb', price: 1.50, unit: 'bunch' },
    { id: 24, image: 'images/spring-onion.jpg', name: 'Spring Onion', thaiName: 'ต้นหอม', category: 'herb', price: 1.20, unit: 'bunch' },
    { id: 25, image: 'images/thyme.jpg', name: 'Thyme', thaiName: 'ไธม์', category: 'herb', price: 2.50, unit: 'bunch' },
    { id: 26, image: 'images/mint.jpg', name: 'Mint', thaiName: 'สะระแหน่', category: 'herb', price: 1.80, unit: 'bunch' },

    // Spices and Chilies
    { id: 27, image: 'images/bird-chilli.jpg', name: 'Small Hot Chilli (Bird Chilli)', thaiName: 'พริกขี้หนูสวน', category: 'spice', price: 3.20, unit: 'kg' },
    { id: 28, image: 'images/red-chilli.jpg', name: 'Red Small Chilli (Prik Jinda Dang)', thaiName: 'พริกจินดาแดง', category: 'spice', price: 3.50, unit: 'kg' },
    { id: 29, image: 'images/green-chilli.jpg', name: 'Green Small Chilli (Prik Jinda Keaw)', thaiName: 'พริกจินดาเขียว', category: 'spice', price: 3.50, unit: 'kg' },
    { id: 30, image: 'images/big-green-chilli.jpg', name: 'Big Green Chilli (Prik Chee Fa Keaw)', thaiName: 'พริกชี้ฟ้าเขียว', category: 'spice', price: 3.00, unit: 'kg' },
    { id: 31, image: 'images/big-red-chilli.jpg', name: 'Big Red Chilli (Prik Chee Fa Dang)', thaiName: 'พริกชี้ฟ้าแดง', category: 'spice', price: 3.00, unit: 'kg' },
    { id: 32, image: 'images/big-yellow-chilli.jpg', name: 'Big Yellow Chilli (Prik Chee Fa Leang)', thaiName: 'พริกชี้ฟ้าเหลือง', category: 'spice', price: 3.20, unit: 'kg' },
    { id: 33, image: 'images/mild-chilli.jpg', name: 'Mild Chilli', thaiName: 'พริกหยวกเขียว', category: 'spice', price: 2.80, unit: 'kg' },
    { id: 34, image: 'images/mixed-chilli.jpg', name: 'Red and Green - Mixed Chilli', thaiName: 'พริกจินดา แดง&เขียว ผสม', category: 'spice', price: 3.30, unit: 'kg' },
    { id: 35, image: 'images/green-capsicum.jpg', name: 'Green Capcicum', thaiName: 'พริกหวานเขียว', category: 'spice', price: 2.50, unit: 'kg' },
    { id: 36, image: 'images/red-capsicum.jpg', name: 'Red Capcicum', thaiName: 'พริกหวานแดง', category: 'spice', price: 2.80, unit: 'kg' },
    { id: 37, image: 'images/yellow-capsicum.jpg', name: 'Yellow Capcicum', thaiName: 'พริกหวานเหลือง', category: 'spice', price: 2.80, unit: 'kg' },
    { id: 38, image: 'images/pepper-corn.jpg', name: 'Pepper Corn', thaiName: 'พริกไทยสด', category: 'spice', price: 4.00, unit: 'kg' },
    { id: 39, image: 'images/young-ginger.jpg', name: 'Young Ginger', thaiName: 'ขิงอ่อน', category: 'spice', price: 2.20, unit: 'kg' },
    { id: 40, image: 'images/old-ginger.jpg', name: 'Old Ginger', thaiName: 'ขิงแก่', category: 'spice', price: 2.00, unit: 'kg' },
    { id: 41, image: 'images/ginger-sliced.jpg', name: 'Ginger Sliced', thaiName: 'ขิงซอย', category: 'spice', price: 3.50, unit: 'kg' },
    { id: 42, image: 'images/young-galangal.jpg', name: 'Young Galangal', thaiName: 'ข่าอ่อน', category: 'spice', price: 2.80, unit: 'kg' },
    { id: 43, image: 'images/old-galangal.jpg', name: 'Old Galangal', thaiName: 'ข่าแก่', category: 'spice', price: 2.50, unit: 'kg' },
    { id: 44, image: 'images/galangal.jpg', name: 'Galingal', thaiName: 'ข่า', category: 'spice', price: 2.60, unit: 'kg' },
    { id: 45, image: 'images/galangal-sliced.jpg', name: 'Galingal Sliced', thaiName: 'กระชายซอย', category: 'spice', price: 3.80, unit: 'kg' },
    { id: 46, image: 'images/turmeric.jpg', name: 'Turmeric', thaiName: 'ขมิ้น', category: 'spice', price: 2.40, unit: 'kg' },
    { id: 47, image: 'images/lemongrass.jpg', name: 'Lemongrass', thaiName: 'ตะไคร้', category: 'spice', price: 1.80, unit: 'bunch' },

    // Leafy Greens
    { id: 48, image: 'images/young-kale.jpg', name: 'Young Kale', thaiName: 'คะน้าอ่อน', category: 'leafy', price: 2.20, unit: 'kg' },
    { id: 49, image: 'images/kale.jpg', name: 'Kale', thaiName: 'คะน้า', category: 'leafy', price: 2.00, unit: 'kg' },
    { id: 50, image: 'images/chinese-lettuce.jpg', name: 'Chinese Cantonese lettuce', thaiName: '', category: 'leafy', price: 1.80, unit: 'kg' },
    { id: 51, image: 'images/flowering-cabbage.jpg', name: 'Flowering Cabbage', thaiName: 'กวางตุ้งมีดอก', category: 'leafy', price: 1.90, unit: 'kg' },
    { id: 52, image: 'images/hongkong-kale.jpg', name: 'Hongkong Kale', thaiName: 'คะน้าฮ่องกง', category: 'leafy', price: 2.20, unit: 'kg' },
    { id: 53, image: 'images/chinese-cabbage.jpg', name: 'Chinese Cabbage', thaiName: 'ผักกาดขาว', category: 'leafy', price: 1.50, unit: 'kg' },
    { id: 54, image: 'images/bok-choy.jpg', name: 'Bok Choy Hongkong', thaiName: 'บอคฉ่อยฮ่องกง', category: 'leafy', price: 2.00, unit: 'kg' },
    { id: 55, image: 'images/choy-sum.jpg', name: 'Choy Sum', thaiName: 'กวางตุ้ง', category: 'leafy', price: 1.80, unit: 'kg' },
    { id: 56, image: 'images/baby-bok-choy.jpg', name: 'Baby Bok Choy', thaiName: 'เบบี้บอคฉ่อย', category: 'leafy', price: 2.50, unit: 'kg' },
    { id: 57, image: 'images/chinese-morning-glory.jpg', name: 'Chinese Morning Glory', thaiName: 'ผักบุ้งจีน', category: 'leafy', price: 1.20, unit: 'kg' },
    { id: 58, image: 'images/thai-morning-glory.jpg', name: 'Thai Morning Glory', thaiName: 'ผักบุ้งไทย', category: 'leafy', price: 1.20, unit: 'kg' },
    { id: 59, image: 'images/water-mimosa.jpg', name: 'Water Mimosa', thaiName: 'กระเฉด', category: 'leafy', price: 2.00, unit: 'kg' },
    { id: 60, image: 'images/spinach.jpg', name: 'Spinach', thaiName: 'ผักโขม', category: 'leafy', price: 2.50, unit: 'kg' },
    { id: 61, image: 'images/leek.jpg', name: 'Leek', thaiName: 'ต้นหอมญี่ปุ่น', category: 'leafy', price: 3.00, unit: 'kg' },
    { id: 62, image: 'images/baby-leek.jpg', name: 'Baby Leek', thaiName: 'ต้นหอมญี่ปุ่น ต้นเล็กๆ', category: 'leafy', price: 3.50, unit: 'kg' },
    { id: 63, image: 'images/cauliflower.jpg', name: 'Cauliflower', thaiName: 'กะหล่ำดอก', category: 'leafy', price: 2.80, unit: 'kg' },
    { id: 64, image: 'images/chinese-chives.jpg', name: 'Chinese Chives', thaiName: 'กุยช่าย', category: 'leafy', price: 2.00, unit: 'kg' },
    { id: 65, image: 'images/chives-flower.jpg', name: 'Chives Flower', thaiName: 'ดอกกุยช่าย', category: 'leafy', price: 2.50, unit: 'kg' },
    { id: 66, image: 'images/baby-kailan.jpg', name: 'Baby Kailan', thaiName: 'แขนง', category: 'leafy', price: 3.00, unit: 'kg' },
    { id: 67, image: 'images/thai-celery.jpg', name: 'Thai Celery', thaiName: 'ขึ้นฉ่าย', category: 'leafy', price: 1.80, unit: 'kg' },
    { id: 68, image: 'images/celery-stick.jpg', name: 'Celery Stick', thaiName: 'ก้านเซเลอรี่', category: 'leafy', price: 2.20, unit: 'kg' },
    { id: 69, image: 'images/kankun.jpg', name: 'Kankun', thaiName: 'ผักบุ้งจีน', category: 'leafy', price: 1.50, unit: 'kg' },
    { id: 70, image: 'images/broccoli.jpg', name: 'Broccoli', thaiName: 'บรอคโคลี่', category: 'leafy', price: 3.80, unit: 'kg' },
    { id: 71, image: 'images/brocollini.jpg', name: 'Brocollini', thaiName: 'เบบี้บรอคโคลี่', category: 'leafy', price: 4.20, unit: 'kg' },
    { id: 72, image: 'images/asparagus.jpg', name: 'Asparagus', thaiName: 'หน่อไม้ฝรั่ง', category: 'leafy', price: 6.50, unit: 'kg' },
    { id: 73, image: 'images/cabbage.jpg', name: 'Cabbage', thaiName: 'กะหล่ำปลี', category: 'leafy', price: 1.20, unit: 'kg' },
    { id: 74, image: 'images/violet-cabbage.jpg', name: 'Violet Cabbage', thaiName: 'กะหล่ำปลีม่วง', category: 'leafy', price: 1.50, unit: 'kg' },
    { id: 75, image: 'images/ivy-gourd.jpg', name: 'Ivy Gourd', thaiName: 'ตำลึง', category: 'leafy', price: 1.80, unit: 'kg' },
    { id: 76, image: 'images/penny-worth.jpg', name: 'Penny Worth', thaiName: 'ใบบัวบก', category: 'leafy', price: 2.00, unit: 'kg' },
    { id: 77, image: 'images/betel-leaf.jpg', name: 'Betel Leaf', thaiName: 'ใบชะพลู', category: 'leafy', price: 2.50, unit: 'kg' },

    // Vegetables
    { id: 78, image: 'images/small-eggplant.jpg', name: 'Small Eggplant', thaiName: 'มะเขือลูกเล็ก', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 79, image: 'images/thai-eggplant.jpg', name: 'Thai Eggplant', thaiName: 'มะเขือเทศไทย', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 80, image: 'images/purple-eggplant.jpg', name: 'Purple Eggplant', thaiName: 'มะเขือม่วง', category: 'vegetable', price: 2.20, unit: 'kg' },
    { id: 81, image: 'images/green-eggplant.jpg', name: 'Green Eggplant', thaiName: 'มะเขือเขียว', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 82, image: 'images/pea-eggplant.jpg', name: 'Pea Eggplant', thaiName: 'มะเขือพวง', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 83, image: 'images/large-tomato.jpg', name: 'Large Tomato', thaiName: 'มะเขือเทศลูกใหญ่', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 84, image: 'images/small-tomato.jpg', name: 'Small Tomato', thaiName: 'มะเขือเทศลูกเล็ก', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 85, image: 'images/cherry-tomato.jpg', name: 'Cherry Tomato', thaiName: 'มะเขือเทศเชอร์รี่', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 86, image: 'images/cucumber.jpg', name: 'Cucumber', thaiName: 'แตงกวา', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 87, image: 'images/baby-cucumber.jpg', name: 'Baby Cucumber', thaiName: 'แตงกวาเล็ก', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 88, image: 'images/long-bean.jpg', name: 'Long Bean', thaiName: 'ถั่วฝักยาว', category: 'vegetable', price: 2.20, unit: 'kg' },
    { id: 89, image: 'images/green-bean.jpg', name: 'Green Bean', thaiName: 'ถั่วแขก', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 90, image: 'images/snake-bean.jpg', name: 'Snake Bean', thaiName: 'ถั่วพู', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 91, image: 'images/corn.jpg', name: 'Corn', thaiName: 'ข้าวโพด', category: 'vegetable', price: 1.20, unit: 'piece' },
    { id: 92, image: 'images/baby-corn.jpg', name: 'Baby Corn', thaiName: 'ข้าวโพดอ่อน', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 93, image: 'images/okra.jpg', name: 'Okra', thaiName: 'กระเจี๊ยบเขียว', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 94, image: 'images/lotus-root.jpg', name: 'Lotus Root', thaiName: 'รากบัว', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 95, image: 'images/lotus-stem.jpg', name: 'Lotus Stem', thaiName: 'สายบัว', category: 'vegetable', price: 3.20, unit: 'kg' },
    { id: 96, image: 'images/bamboo-shoot.jpg', name: 'Bamboo Shoot', thaiName: 'หน่อไม้', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 97, image: 'images/carrot.jpg', name: 'Carrot', thaiName: 'แครอท', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 98, image: 'images/onion.jpg', name: 'Onion', thaiName: 'หอมใหญ่', category: 'vegetable', price: 1.00, unit: 'kg' },
    { id: 99, image: 'images/long-bean-green.jpg', name: 'Long Bean - Green', thaiName: 'ถั่วฝักยาว', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 100, image: 'images/long-bean-red.jpg', name: 'Long Bean - Red', thaiName: 'ถั่วฝักยาวสีแดง', category: 'vegetable', price: 2.20, unit: 'kg' },
    { id: 101, image: 'images/snow-pea.jpg', name: 'Snow Pea', thaiName: 'ถั่วลันเตา', category: 'vegetable', price: 4.50, unit: 'kg' },
    { id: 102, image: 'images/sugar-snap-pea.jpg', name: 'Sugar Snap Pea', thaiName: 'ถั่วลันเตาหวาน', category: 'vegetable', price: 5.00, unit: 'kg' },
    { id: 103, image: 'images/bush-bean.jpg', name: 'Bush Bean', thaiName: 'ถั่วแขก', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 104, image: 'images/wing-bean.jpg', name: 'Wing Bean', thaiName: 'ถั่วพู', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 105, image: 'images/red-radish.jpg', name: 'Red Radish', thaiName: 'แรดิชแดง', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 106, image: 'images/garlic.jpg', name: 'Garlic', thaiName: 'กระเทียม', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 107, image: 'images/young-wax-gourd.jpg', name: 'Young Wax Gourd', thaiName: 'ฟักอ่อน', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 108, image: 'images/old-wax-gourd.jpg', name: 'Old Wax Gourd', thaiName: 'ฟักแก่', category: 'vegetable', price: 1.20, unit: 'kg' },
    { id: 109, image: 'images/chinese-bitter-gourd.jpg', name: 'Chinese Bitter Gourd', thaiName: 'มะระ', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 110, image: 'images/small-wild-bitter-gourd.jpg', name: 'Small Wild Bitter Gourd', thaiName: 'มะระขี้นก', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 111, image: 'images/pumpkin.jpg', name: 'Pumpkin', thaiName: 'ฟักทอง', category: 'vegetable', price: 1.20, unit: 'kg' },
    { id: 112, image: 'images/green-papaya.jpg', name: 'Green Papaya', thaiName: 'มะละกอดิบ', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 113, image: 'images/young-jack-fruit.jpg', name: 'Young Jack Fruit', thaiName: 'ขนุนอ่อน', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 114, image: 'images/beetroot.jpg', name: 'Beetroot', thaiName: 'บีทรูท', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 115, image: 'images/drum-stick.jpg', name: 'Drum Stick', thaiName: 'มะรุม', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 116, image: 'images/round-luffa.jpg', name: 'Round Luffa', thaiName: 'บวบหอม', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 117, image: 'images/angled-luffa.jpg', name: 'Angled Luffa', thaiName: 'บวบเหลี่ยม', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 118, image: 'images/japanese-cucumber.jpg', name: 'Japanese Cucumber', thaiName: 'แตงกวาญี่ปุ่น', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 119, image: 'images/cucumber.jpg', name: 'Thai Cucumber', thaiName: 'แตงกวาไทย', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 120, image: 'images/eggplant.jpg', name: 'Thai Eggplant', thaiName: 'มะเขือเปราะ', category: 'vegetable', price: 1.70, unit: 'kg' },
    { id: 121, image: 'images/continental-cucumber.jpg', name: 'Continental Cucumber', thaiName: 'แตงล้าน', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 122, image: 'images/green-zucchini.jpg', name: 'Green Zucchini', thaiName: 'ซูกินี่', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 123, image: 'images/yellow-zucchini.jpg', name: 'Yellow Zucchini', thaiName: 'ซูกินี่เหลือง', category: 'vegetable', price: 3.20, unit: 'kg' },
    { id: 124, image: 'images/baby-corn.jpg', name: 'Baby Corn', thaiName: 'ข้าวโพดอ่อน', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 125, image: 'images/sweet-corn.jpg', name: 'Sweet Corn', thaiName: 'ข้าวโพดหวาน', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 126, image: 'images/corn-on-cob.jpg', name: 'Corn On The Cob', thaiName: 'ข้าวโพดหวาน', category: 'vegetable', price: 1.20, unit: 'kg' },
    { id: 127, image: 'images/pandanus-leaf.jpg', name: 'Pandanus Leaf', thaiName: 'ใบเตย', category: 'vegetable', price: 1.50, unit: 'bunch' },
    { id: 128, image: 'images/bean-sprouts.jpg', name: 'Mung Bean Sprout', thaiName: 'ถั่วงอกเขียว', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 129, image: 'images/snow-peas-sprout.jpg', name: 'Snow Peas Sprout', thaiName: 'โตเหมี่ยว', category: 'vegetable', price: 4.00, unit: 'kg' },
    { id: 130, image: 'images/sunflower-sprout.jpg', name: 'Sunflower Sprout', thaiName: 'ต้นอ่อนทานตะวัน', category: 'vegetable', price: 4.50, unit: 'kg' },
    { id: 131, image: 'images/bean-sprouts.jpg', name: 'Bean Sprouts', thaiName: 'ถั่วงอก', category: 'vegetable', price: 1.20, unit: 'kg' },
    { id: 132, image: 'images/kae-flower.jpg', name: 'Kae Flower', thaiName: 'ดอกแค', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 133, image: 'images/pea-flower.jpg', name: 'Pea Flower', thaiName: 'ดอกอัญชัน', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 134, image: 'images/cowslip-flower.jpg', name: 'Cowslip Creeper Flower', thaiName: 'ดอกขจร', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 135, image: 'images/sesbania-flower.jpg', name: 'Sesbania Flower', thaiName: 'ดอกโสน', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 136, image: 'images/baegu.jpg', name: 'Baegu (Leang Leaf)', thaiName: 'ใบเหลียง', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 137, image: 'images/lotus-leaf.jpg', name: 'Lotus Leaf', thaiName: 'ใบบัว', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 138, image: 'images/banana-leaf.jpg', name: 'Banana Leaf HALF', thaiName: 'ใบตอง แบบครึ่ง', category: 'vegetable', price: 1.50, unit: 'piece' },
    { id: 139, image: 'images/banana-blossom.jpg', name: 'Banana Blossom', thaiName: 'หัวปลี', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 140, image: 'images/cilantro.jpg', name: 'Cilantro', thaiName: 'ผักชี', category: 'herb', price: 2.20, unit: 'bunch' },
    { id: 141, image: 'images/mint.jpg', name: 'Mint', thaiName: 'สะระแหน่', category: 'herb', price: 2.00, unit: 'bunch' },
    { id: 142, image: 'images/coriander-root.jpg', name: 'Coriander Root', thaiName: 'รากผักชี', category: 'vegetable', price: 2.00, unit: 'kg' },
    { id: 143, image: 'images/chinese-radish.jpg', name: 'Chinese Radish', thaiName: 'หัวไชเท้า', category: 'vegetable', price: 1.50, unit: 'kg' },
    { id: 144, image: 'images/hearts-of-palm.jpg', name: 'Hearts of Palm', thaiName: 'ยอดมะพร้าว', category: 'vegetable', price: 4.00, unit: 'kg' },
    { id: 145, image: 'images/taro.jpg', name: 'Taro', thaiName: 'เผือก', category: 'vegetable', price: 1.80, unit: 'kg' },
    { id: 146, image: 'images/endive.jpg', name: 'Endive', thaiName: 'ผักสลัดเอนไดส์', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 147, image: 'images/mustard-leaf.jpg', name: 'Mustard Leaf', thaiName: 'มัสตารส์', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 148, image: 'images/watercress.jpg', name: 'Watercress', thaiName: 'วอเตอร์เครส', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 149, image: 'images/radicchio.jpg', name: 'Radicchio', thaiName: 'เรดิชชิโอ', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 150, image: 'images/green-coral.jpg', name: 'Green Coral (Lettuce Lollo Rosso Green)', thaiName: 'กรีนโรคอล', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 151, image: 'images/red-coral.jpg', name: 'Red Coral (Lettuce Lollo Rosso Red)', thaiName: 'กรีนโรคอล', category: 'vegetable', price: 3.00, unit: 'kg' },
    { id: 152, image: 'images/butterhead.jpg', name: 'Butterhead', thaiName: 'บัตเตอร์เฮด', category: 'vegetable', price: 3.20, unit: 'kg' },
    { id: 153, image: 'images/romaine.jpg', name: 'Romaine', thaiName: 'ผักสลักโรเมน', category: 'vegetable', price: 2.80, unit: 'kg' },
    { id: 154, image: 'images/baby-romaine.jpg', name: 'Baby Romaine', thaiName: 'เบบี้โรเมน', category: 'vegetable', price: 3.50, unit: 'kg' },
    { id: 155, image: 'images/iceberg.jpg', name: 'Iceberg', thaiName: 'ไอซ์เบริก', category: 'vegetable', price: 2.50, unit: 'kg' },
    { id: 156, image: 'images/rocket.jpg', name: 'Rocket', thaiName: 'ผักร็อคเกต', category: 'vegetable', price: 4.00, unit: 'kg' },
    { id: 157, image: 'images/green-oak.jpg', name: 'Green Oak Lettuce', thaiName: 'กรีนโอค', category: 'vegetable', price: 3.20, unit: 'kg' },
    { id: 158, image: 'images/red-oak.jpg', name: 'Red Oak Lettuce', thaiName: 'เรดโอ๊ค', category: 'vegetable', price: 3.20, unit: 'kg' },
    { id: 159, image: 'images/cerily-kale.jpg', name: 'Cerily Kale', thaiName: 'ผักเคล', category: 'vegetable', price: 4.00, unit: 'kg' },
    { id: 160, image: 'images/frillice-iceberg.jpg', name: 'Frillice Iceberg', thaiName: 'ฟิลเลย์ ไอซ์เบิร์ก', category: 'vegetable', price: 3.50, unit: 'kg' },

    // Fruits
    { id: 161, image: 'images/mangosteen.jpg', name: 'Mangosteen', thaiName: 'มังคุด', category: 'fruit', price: 5.00, unit: 'kg' },
    { id: 162, image: 'images/rambutan.jpg', name: 'Rambutan', thaiName: 'เงาะ', category: 'fruit', price: 4.50, unit: 'kg' },
    { id: 163, image: 'images/longan.jpg', name: 'Longan', thaiName: 'ลำไย', category: 'fruit', price: 4.00, unit: 'kg' },
    { id: 164, image: 'images/lychee.jpg', name: 'Lychee', thaiName: 'ลิ้นจี่', category: 'fruit', price: 5.50, unit: 'kg' },
    { id: 165, image: 'images/mango.jpg', name: 'Mango', thaiName: 'มะม่วง', category: 'fruit', price: 3.50, unit: 'kg' },
    { id: 166, image: 'images/green-mango.jpg', name: 'Green Mango', thaiName: 'มะม่วงเขียว', category: 'fruit', price: 3.00, unit: 'kg' },
    { id: 167, image: 'images/papaya.jpg', name: 'Papaya', thaiName: 'มะละกอสุก', category: 'fruit', price: 2.50, unit: 'kg' },
    { id: 168, image: 'images/pineapple.jpg', name: 'Pineapple', thaiName: 'สับปะรด', category: 'fruit', price: 2.00, unit: 'kg' },
    { id: 169, image: 'images/watermelon.jpg', name: 'Watermelon', thaiName: 'แตงโม', category: 'fruit', price: 1.80, unit: 'kg' },
    { id: 170, image: 'images/cantaloupe.jpg', name: 'Cantaloupe', thaiName: 'แคนตาลูป', category: 'fruit', price: 2.50, unit: 'kg' },
    { id: 171, image: 'images/dragon-fruit.jpg', name: 'Dragon Fruit', thaiName: 'แก้วมังกร', category: 'fruit', price: 3.50, unit: 'kg' },
    { id: 172, image: 'images/guava.jpg', name: 'Guava', thaiName: 'ฝรั่ง', category: 'fruit', price: 2.80, unit: 'kg' },
    { id: 173, image: 'images/pomelo.jpg', name: 'Pomelo', thaiName: 'ส้มโอ', category: 'fruit', price: 3.00, unit: 'kg' },
    { id: 174, image: 'images/durian.jpg', name: 'Durian', thaiName: 'ทุเรียน', category: 'fruit', price: 8.00, unit: 'kg' },
    { id: 175, image: 'images/banana.jpg', name: 'Banana', thaiName: 'กล้วย', category: 'fruit', price: 1.50, unit: 'kg' },
    { id: 176, image: 'images/coconut.jpg', name: 'Coconut', thaiName: 'มะพร้าว', category: 'fruit', price: 2.00, unit: 'piece' },
    { id: 177, image: 'images/jackfruit.jpg', name: 'Jackfruit', thaiName: 'ขนุน', category: 'fruit', price: 3.50, unit: 'kg' },
    { id: 178, image: 'images/rose-apple.jpg', name: 'Rose Apple', thaiName: 'ชมพู่', category: 'fruit', price: 2.80, unit: 'kg' },
    { id: 179, image: 'images/custard-apple.jpg', name: 'Custard Apple', thaiName: 'น้อยหน่า', category: 'fruit', price: 4.00, unit: 'kg' },
    { id: 180, image: 'images/star-fruit.jpg', name: 'Star Fruit', thaiName: 'มะเฟือง', category: 'fruit', price: 2.50, unit: 'kg' },
];

module.exports = priceListData;