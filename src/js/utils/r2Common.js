/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
(function(){
	window.R2 = window.R2 || {};
})();

(function(R2) {

	window.R2 = R2 || {};

    R2.Dialog = {
        zIndex : 3000,
        getZIndex : function(){
            var dialog = document.querySelectorAll('.r2-dialog');
            var zIndex = this.zIndex;
            if(dialog.length > 0){
				Array.prototype.forEach.call(dialog,function(element){
					var dialogZIndex = parseInt( element.style['z-index'], 10);
					zIndex = (dialogZIndex > zIndex) ? dialogZIndex : zIndex;
				})
			}
            return zIndex;
        },
        setZIndex : function(index){
            this.zIndex = index;
        },
        render : function(className, content){
            var dialog = document.createElement('div');
			var dialogMain = null;
            var dialogBackdrop = document.createElement('div');
            var zIndex = this.getZIndex();

            dialog.className = 'r2-dialog ' + className;
			dialog.style['z-index'] = zIndex + 1;

            dialogBackdrop.className = 'r2-dialog-backdrop';

			if(typeof content === 'string'){
                var div = document.createElement('div');
                div.innerHTML = content;
                dialogMain = div;
			} else {
				dialogMain = content;
			}

            dialogMain.className = 'r2-dialog-main ' + dialogMain.className;
            dialog.appendChild(dialogBackdrop);
            dialog.appendChild(dialogMain);
			document.body.appendChild(dialog);
			return dialog;
        },

        destroy:function(className){

			var dialogs = document.querySelectorAll( '.' + (className || 'r2-dialog') );

			if(dialogs.length === 0) return;
			Array.prototype.forEach.call(dialogs, function(element){
				if(element.parentNode){
					 element.parentNode.removeChild(element);
				}
			})
		},

        rePosition:function(className){
			var modal_backdrop = document.getElementsByClassName('r2-dialog-backdrop')[0];
			var modal = document.getElementsByClassName('r2-dialog-main')[0];

			var modal_backdrop_h = modal_backdrop.offsetHeight
			,modal_h = modal.offsetHeight;

			var modal_top = 0;

			if(modal_backdrop_h > modal_h){
				modal_top = Math.abs(parseInt((modal_backdrop_h)/3,10) - parseInt(modal_h/3,10));
			} else {
				modal_top = Math.abs(parseInt(modal_h/3,10) - parseInt((modal_backdrop_h)/3,10));
			}

			var modal_backdrop_w = modal_backdrop.offsetWidth
			,modal_w = modal.offsetWidth

			modal.style.top = modal_top + 'px';
        },

		isOpen:function(className){
			if(!className) return;
			var dialogs = document.querySelectorAll('.' + className);
			return (dialogs.length > 0);
		}
    }

})(R2);
