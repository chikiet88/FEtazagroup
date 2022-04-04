SELECT * FROM`KhachhangDetail` WHERE Chinhanh = "Thủ Đức"

UPDATE `KhachhangDetail` SET`Chinhanh` = 'f54de1e1-66bd-4690-8015-ad7315d6f14e' WHERE`KhachhangDetail`.`Chinhanh` = 'Thủ Đức';
UPDATE `KhachhangDetail` SET`Chinhanh` = '268b7a06-d2c5-4c98-af1d-334144ae280f' WHERE`KhachhangDetail`.`Chinhanh` = 'Gò Vấp';
UPDATE `KhachhangDetail` SET`Chinhanh` = 'ca725bf4-4810-4ea2-8ef2-520b2a3121cc' WHERE`KhachhangDetail`.`Chinhanh` = 'Quận 10';
UPDATE `KhachhangDetail` SET`Chinhanh` = 'e173b1c0-fbdb-4eeb-a00c-b56664068515' WHERE`KhachhangDetail`.`Chinhanh` = 'Nha Trang';
UPDATE `KhachhangDetail` SET`Chinhanh` = '9887ad61-4b2c-4db1-83e6-570f33cb540a' WHERE`KhachhangDetail`.`Chinhanh` = 'Đà Nẵng';
UPDATE `KhachhangDetail` SET`Chinhanh` = 'd516ed9c-5453-4c1e-9c05-40de3cd0e7b1' WHERE`KhachhangDetail`.`Chinhanh` = 'Bình Thạnh';

UPDATE `Khachhang` SET`Chinhanh` = 'f54de1e1-66bd-4690-8015-ad7315d6f14e' WHERE`Khachhang`.`Chinhanh` = 'Thủ Đức';
UPDATE `Khachhang` SET`Chinhanh` = '268b7a06-d2c5-4c98-af1d-334144ae280f' WHERE`Khachhang`.`Chinhanh` = 'Gò Vấp';
UPDATE `Khachhang` SET`Chinhanh` = 'ca725bf4-4810-4ea2-8ef2-520b2a3121cc' WHERE`Khachhang`.`Chinhanh` = 'Quận 10';
UPDATE `Khachhang` SET`Chinhanh` = 'e173b1c0-fbdb-4eeb-a00c-b56664068515' WHERE`Khachhang`.`Chinhanh` = 'Nha Trang';
UPDATE `Khachhang` SET`Chinhanh` = '9887ad61-4b2c-4db1-83e6-570f33cb540a' WHERE`Khachhang`.`Chinhanh` = 'Đà Nẵng';
=IF(K7="Quận 10";"ca725bf4-4810-4ea2-8ef2-520b2a3121cc";IF(K7="Gò Vấp";"268b7a06-d2c5-4c98-af1d-334144ae280f";IF(K7="Thủ Đức";"f54de1e1-66bd-4690-8015-ad7315d6f14e";IF(K7="Đà Nẵng";"9887ad61-4b2c-4db1-83e6-570f33cb540a";"e173b1c0-fbdb-4eeb-a00c-b56664068515"))))
{
    "268b7a06-d2c5-4c98-af1d-334144ae280f": "Chi Nhánh Thủ Đức",
    "f54de1e1-66bd-4690-8015-ad7315d6f14e": "Chi Nhánh Gò Vấp",
    "ca725bf4-4810-4ea2-8ef2-520b2a3121cc": "Chi Nhánh Quận 10",
    "e173b1c0-fbdb-4eeb-a00c-b56664068515": "Chi Nhánh Nha Trang",
    "9887ad61-4b2c-4db1-83e6-570f33cb540a": "Chi Nhánh Đà Nẵng"
}
{
    "268b7a06-d2c5-4c98-af1d-334144ae280f": "Chi Nhánh Gò Vấp",
    "f54de1e1-66bd-4690-8015-ad7315d6f14e": "Chi Nhánh Thủ Đức",
    "ca725bf4-4810-4ea2-8ef2-520b2a3121cc": "Chi Nhánh Quận 10",
    "e173b1c0-fbdb-4eeb-a00c-b56664068515": "Chi Nhánh Nha Trang",
    "9887ad61-4b2c-4db1-83e6-570f33cb540a": "Chi Nhánh Đà Nẵng"
}