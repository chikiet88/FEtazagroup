export const characterAttributesMapping = {
  TenKH: 'TenKH',
  SDT: 'SDT',
  TDS: 'TDS',
  TTT: 'TTT',
  LMD: 'LMD',
  NMD: 'NMD',
  LMC: 'LMC',
  NMC: 'NMC',

};
export interface Character {
  TenKH: string,
  SDT: string,
  TDS: string,
  TTT: string,
  LMD: Date,
  NMD: string,
  LMC: Date,
  NMC: string,
}

export const KhachhangMapping = {
  NgayTaoDV:"NgayTaoDV",
  TenKH: "TenKH",
  SDT: "SDT",
  SDT2: "SDT2",
  Dichvu: "Dichvu",
  Doanhso: "Doanhso",
  Tonglieutrinh: "Tonglieutrinh",
  Dathu: "Dathu",
  Ghichu: "Ghichu",
  Chinhanh:"Chinhanh"

};
export interface Khachhang {
  NgayTaoDV:Date,
  TenKH: string,
  SDT: string,
  SDT2: string,
  Dichvu: string,
  Doanhso: string,
  Tonglieutrinh: string,
  Dathu: string,
  Ghichu: string,
  Chinhanh: string,
}
