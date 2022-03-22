
let x=[
    'Normal Team 1 - Quận 10',
    'Silver Team 1 - Quận 10',
    'Member Team 1 - Quận 10',
      'Gold Team 1 - Quận 10',
  'Platinum Team 1 - Quận 10',
   'Diamond Team 2 - Quận 10',
    'Normal Team 2 - Quận 10',
    'Silver Team 2 - Quận 10',
    'Member Team 2 - Quận 10',
      'Gold Team 2 - Quận 10',
  'Platinum Team 2 - Quận 10',
   'Diamond Team 2 - Quận 10',
    'Normal Team 1 - Thủ Đức',
    'Silver Team 1 - Thủ Đức',
    'Member Team 1 - Thủ Đức',
      'Gold Team 1 - Thủ Đức',
  'Platinum Team 1 - Thủ Đức',
   'Diamond Team 2 - Thủ Đức',
    'Normal Team 2 - Thủ Đức',
    'Silver Team 2 - Thủ Đức',
    'Member Team 2 - Thủ Đức',
      'Gold Team 2 - Thủ Đức',
  'Platinum Team 2 - Thủ Đức',
   'Diamond Team 2 - Thủ Đức',
    'Normal Team 1 - Gò Vấp',
    'Silver Team 1 - Gò Vấp',
    'Member Team 1 - Gò Vấp',
      'Gold Team 1 - Gò Vấp',
  'Platinum Team 1 - Gò Vấp',
   'Diamond Team 2 - Gò Vấp',
    'Normal Team 2 - Gò Vấp',
    'Silver Team 2 - Gò Vấp',
    'Member Team 2 - Gò Vấp',
      'Gold Team 2 - Gò Vấp',
  'Platinum Team 2 - Gò Vấp',
   'Diamond Team 2 - Gò Vấp',
    'Normal Team 1 - Đà Nẵng',
    'Silver Team 1 - Đà Nẵng',
    'Member Team 1 - Đà Nẵng',
      'Gold Team 1 - Đà Nẵng',
  'Platinum Team 1 - Đà Nẵng',
   'Diamond Team 2 - Đà Nẵng',
    'Normal Team 2 - Đà Nẵng',
    'Silver Team 2 - Đà Nẵng',
    'Member Team 2 - Đà Nẵng',
      'Gold Team 2 - Đà Nẵng',
  'Platinum Team 2 - Đà Nẵng',
   'Diamond Team 2 - Đà Nẵng',
    'Normal Team 1 - Nha Trang',
    'Silver Team 1 - Nha Trang',
    'Member Team 1 - Nha Trang',
      'Gold Team 1 - Nha Trang',
  'Platinum Team 1 - Nha Trang',
   'Diamond Team 2 - Nha Trang',
    'Normal Team 2 - Nha Trang',
    'Silver Team 2 - Nha Trang',
    'Member Team 2 - Nha Trang',
      'Gold Team 2 - Nha Trang',
  'Platinum Team 2 - Nha Trang',
   'Diamond Team 2 - Nha Trang',
   
]
setInterval(() => {  
x.forEach((k,v) => {
    console.log(k,v)
    setInterval(() => {
        $('#btnNewTypeAccount').click();
        $('#NameSup').val(k)
        ExcuteData()
    }, v*5000);   
});
},1000);  
