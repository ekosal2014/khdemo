$(document).ready(function(){
	init();	
	$('#id_card').keyup(function(){
		$('#id_card').val(Common.numberWithComma($('#id_card').val().replace(/\-/g, ''),"-"));
	});
	$('#phone').keyup(function(){
		$('#phone').val(Common.phoneWithComma($('#phone').val().replace(/\-/g, ''),"-"));
	});
	
	$('#btn_addMore').click(function(){
		loadingSettingData();
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_loan').bPopup().close();
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
		if($(this).val() == 'decrement'){
			$('#loadingDecrementTypeValue').show();			
		}
		
	});
	
	$('#type_payment').change(function(){
		var opt = '';
		if ($(this).val() == '1'){
			opt += '<option  value="1"> 1 ថ្ងៃ</option>';
			opt += '<option  value="2"> 2 ថ្ងៃ</option>';
			opt += '<option  value="3"> 3 ថ្ងៃ</option>';
			opt += '<option  value="4"> 4 ថ្ងៃ</option>';
			opt += '<option  value="5"> 5 ថ្ងៃ</option>';
		}else if ( $(this).val() == '2'){
			opt += '<option  value="1"> 1 អាទិត្យ</option>';
			opt += '<option  value="2"> 2 អាទិត្យ</option>';
			opt += '<option  value="3"> 3 អាទិត្យ</option>';
		}
		else if ( $(this).val() == '3'){
			opt += '<option  value="1"> 1 ខែ</option>';
			opt += '<option  value="2"> 2 ខែ</option>';
			opt += '<option  value="3"> 3 ខែ</option>';
			opt += '<option  value="4"> 4 ខែ</option>';
			opt += '<option  value="5"> 5 ខែ</option>';
			opt += '<option  value="6"> 6 ខែ</option>';
		
		}
		else if ( $(this).val() == '4'){
			opt += '<option  value="1"> 1 ឆ្នាំ</option>';
			opt += '<option  value="2"> 2 ឆ្នាំ</option>';			
		}
		$('#popu_count_day').empty();
		$('#popu_count_day').append(opt);
	});
	
	
	
	$('.btn_confirm').click(function(){
		$('#loading').bPopup();
		confrimCheck();
		$('#loading').bPopup().close();
	});
	
	$('#btn_save').click(function(){		
		loanSaveLoanAgain();
		
	});
	
});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePicker('popup_start_date');
	$('#popup_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#popup_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
	$('#popup_rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
	$('#popup_decrement').autoNumeric('init', { aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999',vMin: '0'});
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanAgain',
		data:'loaner_id='+$('#loaner_id').val(),
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
				 return;
          }
			if (json.status == 'undefined' || json.status != '0000'){
				 Message.infor(null,json.message);
				return;
			}
			/*$('#loaner_code').val(Common.numberWithComma(json.object.maxLoanerId,"-"));*/
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanerObject.loaner_id,9)));
		    $('#loaner_name').val(json.object.loanerObject.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanerObject.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanerObject.phone_nm));
		    $('input[name=gender][value='+json.object.loanerObject.gender+']').prop('checked',true);
		    $('#address').val('ខេត្ត '+json.object.loanerObject.province.name_kh + '  ស្រុក  '+json.object.loanerObject.district.name_kh + '  ឃុំ  '+json.object.loanerObject.commune.name_kh+'  ភូមិ  '+json.object.loanerObject.village.name_kh);
			$('#loan_code').val(Common.numberWithComma(json.object.maxLoanId,"-"));
			$('#agent_txt').val($('#agent').val());
		},error:function(json){
			console.log(json);
		}
	});
}
/*ប្រភេទបង់ប្រាក់*/
function loadingSettingData(id){
	if ($('#loaner_name').val() == '' || $('#phone').val() == '' || $('#id_card').val() == '' || $('#address').val() == ''){
    	alert('សូមបំពេញពត៍មានរបស់អ្នកខ្ចីមុន ទើបអាចបំពេញទឹកប្រាក់ដែលត្រូវខ្ចីបាន!!');
    	return;
    }
	$('#popup_agent').val($('#agent').val());
	$('#popup_loan').bPopup();
}




function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#popup_total_money').val() == '')
	{
		Message.infor(null,"សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!",null);
		$('#popup_total_money').focus();
		return;
	}
	
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		if ($('#popup_decrement').val() == ''){
			Message.infor(null,"សូមបញ្ចូលចំនួនទឹកប្រាក់ថយពីចំនួនទឹកប្រាក់សន្សំក្នុងពេលបង់មួយលើកៗ",null);
			$('#popup_decrement').focus();
			return;
		}		
	}
	
	if ($('#type_payment').val() == ''){
		Message.infor(null,"សូមជ្រើសរើសប្រភេទនៃការបង់ប្រាក់!",null);
		return;
	}
	
	if ($('#popup_time').val() == ''){
		Message.infor(null,"សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!",null);
		return;
	}
	if ($('#popu_count_day').val() == '' || $('#popu_count_day').val() == '0'){
		Message.infor(null,"សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!",null);
		return;
	}
	if ($('#popup_rate').val() == ''){
		Message.infor(null,"សូមបញ្ចូលអត្រាការប្រាក់ ដើម្បីទូរទាត់ការប្រាក់!",null);
		return;
	}
	
	
	total_money = $('#popup_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim();
	
	time = $('#popup_time').val().replace(/[​\u202f\ដង\,]/g,'');
	rate = $('#popup_rate').val().replace(/[​\u202f\%\,]/g,'');
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day = parseInt($('#type_payment option:selected').attr('data')) * parseInt($('#popu_count_day').val());
	start_date.setDate(start_date.getDate()+ parseInt(day));
	
	/*calculate rate and total money*/
	var tt = ((parseInt(total_money) / time ) * parseFloat(rate)) / 100;
	    tt = Math.round(tt);
	var total_rate = Common.ConvertZeroTwoDigit(tt+'');
	var prak_derm  = Math.round(parseInt(total_money) / time);	
	
	$('#type_loan').val("1");
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		decrement = $('#popup_decrement').val().replace(/[​\u202f\៛\,]/g,'').trim();
		tt = (parseInt(total_money) * parseFloat(rate)) / 100;
		total_rate = Common.ConvertZeroTwoDigit(tt+'');	
		$('#type_loan').val("2");
	}
	
	$('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));	
	$("#total_money_txt").val($('#popup_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + " ៛");
	$('#type_payment_txt').val($('#popu_count_day').val() + $('#type_payment option:selected').text() + ' / ' + 'បង់ម្ដង');
	$('#start_date_txt').val($('#popup_start_date').val());
	$('#time_txt').val(time+' ដង');
	$('#rate_money_txt').val(Common.numberWithComma(total_rate)+' ៛')
	$('#decrement_txt').val(Common.numberWithComma(decrement)+ ' ៛')
	$('#rate_db').val(rate);
	$('#type_payment_db').val($('#type_payment option:selected').val());
	$("#day_db").val(day);
	$('#agent_txt').val($('#agent').val());
	$('#popup_agent').val($('#agent').val());
	
	
	var tbl = '', d = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	for (var i = 1; i <= time; i++){
		var a = 0 ;
		if (parseInt(tt) - parseInt(d) > 0 ){
			a = (parseInt(tt) - parseInt(d)) + parseInt(prak_derm) ;
		}
		var b = Common.ConvertZeroTwoDigit(a+'');
		var c = Common.numberWithComma(b) + ' ៛'
		
		var left =  parseInt(total_money) -  (parseInt(prak_derm) * i)
		
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm">'+prak_derm+'</div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate">'+(parseInt(tt) - parseInt(d))+'</div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left">'+left+'</div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
		
		//set end date
	    start_date.setDate(start_date.getDate() + parseInt(day));	 
	    d = parseInt(d) + parseInt(decrement);
	   
	}
	$('#tbl_lst1 tfoot').hide();
	$('#tbl_lst1 tbody').append(tbl);
	$('#popup_loan').bPopup().close();
}


function loanSaveLoanAgain(){

	if ($('#loaner_name').val() == ''){
    	alert('សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#phone').val() == ''){
    	alert('សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#id_card').val() == ''){
    	alert('សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#address').val() == ''){
    	alert('សូមបញ្ចូលអាស័យដ្ឋានអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }	
	
    $('#loading').bPopup();

    var d = {
			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
			'rate'        :parseFloat($('#rate_db').val()),
			'type_payment':$('#type_payment_db').val(),
			'time'        :parseInt($('#time_txt').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
			'decrement'   :parseInt($('#decrement_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
			'count_day'   :$('#day_db').val(),
			'type_loan'   :'1'
	}
	
	var arr = [];
	arr.push(d);
	
	var data = {
			'loaner_id'   :parseInt($('#loaner_id').val()),
			'loans'       :arr
	
	};
	
	console.log(data);	
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		type:'POST',
 		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
		url :'/khmoney/loanSaveLoanAgain',
		data: JSON.stringify(data),
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,statu){
        	 console.log('error == ' + status);
        	var json = $.parseJSON(xhr.responseText);
        	if (json.status == '901') {
        		  Message.infor(null,json.message,Common.redictPage,json.path);
                  return;
             }
			if (typeof  json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message,null);
				return;
			}
			Message.infor(null,json.message,loanNew);
		},error:function(json){
			console.log(json)
		}
	});
	$('#loading').bPopup().close();
}
function loanNew(){
	window.location.href = '/khmoney/loan';
}
