var Excel = require('exceljs');

var controller = {};

controller.generateExelFile = (payload) => {
    return new Promise((resolve, reject) => {
        console.log(payload)
        payload ? null : reject('Dữ liệu rỗng');
        payload.reportTitle ? null : reject('Vui lòng nhập tiêu đề báo cáo');
        payload.data ? null : reject('Dữ liệu báo cáo không thể rỗng');
        payload.fileName ? null : reject('Vui lòng nhập tên file');

        var workbook = new Excel.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet(payload.fileName);
        // Generate header
        worksheet.getCell('A1').value = "Công ty cổ phần dịch vụ và thương mại EZ-LIFE"
        worksheet.getCell('A2').value = "Địa chỉ: Tầng 23, Tòa nhà Viettel Complex";
        worksheet.getCell('A3').value = "285 Cách Mạng Tháng Tám, phường 12, quận 10, TPHCM";
        worksheet.getCell('A4').value = "MST: 03242435234213";
        worksheet.getCell('A5').value = "Số điện thoại: 0287.234.2352";

        worksheet.getCell('A1').font = { bold: true, size: 16 }
        worksheet.getCell('H1').font = { bold: true, size: 16 }
        worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H3').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H5').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A1:G1');
        worksheet.mergeCells('A2:G2');
        worksheet.mergeCells('A3:G3');
        worksheet.mergeCells('A4:G4');
        worksheet.mergeCells('A5:G5');

        worksheet.getCell('H1').value = "Mẫu số B02 - DNN"
        worksheet.getCell('H2').value = "(Ban hành theo ";
        worksheet.getCell('H3').value = "Thông tư số 200/2014/TT-BTC";
        worksheet.getCell('H4').value = " Ngày 22/12/2014 của Bộ Tài chính)";

        worksheet.mergeCells('H1:L1');
        worksheet.mergeCells('H2:L2');
        worksheet.mergeCells('H3:L3');
        worksheet.mergeCells('H4:L4');
        worksheet.mergeCells('H5:L5');



        let baocao = worksheet.getCell('A7');
        baocao.value = payload.reportTitle;
        baocao.alignment = { vertical: 'middle', horizontal: 'center' };
        baocao.font = { size: 16, bold: true }
        worksheet.mergeCells('A7:L7');

        let startRow = 8;
        for (let i in payload.data) {
            var payloadExcel = worksheet.getRow(startRow++);
            payloadExcel.values = payload.data[i];
        }
        resolve(workbook);
    })
}
getData = (payload) =>{
    let data = [[
        'ID',
        "Khách Hàng",
        "Số Điện Thoại",
        "Gói Dịch Vụ",
        "Số Nhân Viên",
        "Bắt Đầu",
        "Thời gian",
        "Kết thúc",
        "Địa Chỉ",
        "Quận",
        "Trạng Thái"
    ]];
    return new Promise((resolve,reject)=>{
        for (let id in payload.data) {
            let tmp = [];
            tmp.push(payload.data[id].address.id);
            tmp.push(payload.data[id].address.name);
            tmp.push(payload.data[id].address.phone);
            tmp.push(payload.data[id].detail.Service.title);
            tmp.push(payload.data[id].detail.quantity);
            tmp.push(payload.data[id].detail.dateStart);
            tmp.push(payload.data[id].detail.timeStart);
            tmp.push(payload.data[id].detail.dateEnd);
            tmp.push(payload.data[id].address.address);
            tmp.push(payload.data[id].address.district);
            tmp.push(payload.data[id].address.status);
			console.log("\n\nTCL: getData -> tmp", JSON.stringify(tmp))
            data.push(tmp)
			console.log("\n\nTCL: getData -> tmp", JSON.stringify(data))

        }
        resolve(data)
    })
}
controller.exportFile = (payload) => {
	console.log("TCL: controller.exportFile -> payload", JSON.stringify(payload))
    return new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet(payload.fileName);
       
        getData (payload).then((dataGot)=>{
			console.log("TCL: controller.exportFile -> dataGot", JSON.stringify(dataGot))
            let startRow =0;
            for (let i in dataGot) {
                worksheet.getRow(startRow++).values = dataGot[i];
            }
            resolve(workbook);
        })
        
    })
}
module.exports = controller;