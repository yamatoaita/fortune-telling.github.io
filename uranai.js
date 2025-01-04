import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,  get, set, onChildAdded, remove, onChildRemoved } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


class DialogueSystem{
    constructor(orderbox_logined,orderbox_unlogined,speech,btn1,btn2,entry){
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBw7FXEybaL4k61OTcHurPDwYpDkBxwZvo",
            authDomain: "uranai-fc262.firebaseapp.com",
            databaseURL: "https://uranai-fc262-default-rtdb.firebaseio.com",
            projectId: "uranai-fc262",
            storageBucket: "uranai-fc262.firebasestorage.app",
            messagingSenderId: "475399899303",
            appId: "1:475399899303:web:f95e4c527670ce9daf7382",
            databaseURL: "https://uranai-fc262-default-rtdb.firebaseio.com/" 
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
        this.cookie_dbRef =  ref(this.db, `data/cookie`);


        this.dialogue_set =[]; //会話内容　リスト型
        this.speech = speech; //会話を表示させるオブジェクト
        this.dialogue_index = 0; //dialogue_set（会話内容リスト）のindex番号
        this.order_index = 0;
        this.orders = [];//list型。index番号で、行いたい動作(order)を取り出す。
                                       
        this.btn1 = btn1;
        this.btn2 = btn2;
        this.entry = entry;
        
        this.dialogue_changed_flg = 0; //会話が変わったかを示す。０は変わってない。１は変わったことを示す。
        this.order_changed_flg = 0;

        /*以下　各関数ごとの内部インデックス番号。主に、btnを２つ使う関数におけるaddEventLitenerの有効判断に使います*/
        this.func_CHANGE_DS_INDEX_index = 0;
        this.func_CHANGE_DS_PACK_index = 0;

        this.do_consoleflg = 1;
        this.innerfunc_consoleflg = 1;

        //######DialogueSystemを起動した際にはログインしているか判定########
        if(this.do_consoleflg){
            console.log(`__INIT__ %c【IS_LOGINED】`,`color:green`);
        };
        this.orderbox_logined = orderbox_logined;
        this.orderbox_unlogined = orderbox_unlogined;
        this.is_logined();

        //this.modal = document.getElementById("modal");
        //this.uranai_study();
    }

    do(){ 
        //classの基本メソッド。doを作動させて　classを使います。
        
        {//do関数の説明
        /* Dialogue Systemの概要
            1.dictionary_set
            dictionary_setはlist型です。インデックス番号で会話を取り出します。

            2.orders
            ordersはlist型です。インデックス番号で[命令,引数1,(引数2,引数3・・・)]
            をorderに格納します。

            orderからは、order_argに第一引数を（第二引数移行は、各関数で必要に応じて取り出す）
            commandに命令を格納します。
        */
        }
        /*console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>%cvariables are below`,`color:red`);
        var variables = [
            ["USER_NAME",this.user_name],
            ["BIRTH_DAY",this.birth_day ]
        ]
        console.table(variables);
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>%cthat is all`,`color:red`);
        */
       {//btn flg initialization
        this.in_select_uranai = false;

       }

        
        this.order = this.orders[this.order_index];
        //命令書を取り出す
               
        this.order_arg = this.order[1]; //引数を保存
        this.command = this.order[0];//命令を格納
           
        
        //if条件　命令種別を分析
        if(this.command == "next"){
            if(this.do_consoleflg){
                console.log(`in%c【NEXT】`,`color:green`);
            };
            this.next_dialogue();
        }else if(this.command == "to_dialogue"){
            if(this.do_consoleflg){
                console.log(`in%c【TO_DIALOGUE】`,`color:green`);
            };
            this.to_dialogue();
        }else if(this.command == "to_order"){
            if(this.do_consoleflg){
                console.log(`in%c【TO_ORDER】`,`color:green`);
            };
            this.to_order();
        }else if(this.command == "check_<change_d&s_index>"){
            if(this.do_consoleflg){
                console.log(`in%c【CHECK_CHANGE_DS_INDEX】`,`color:green`);
            };
            this.check_change_ds_index();
        }else if(this.command == "change_d&s_pack"){
            if(this.do_consoleflg){
                console.log(`in%c【CHANGE_DS_PACK】`,`color:green`);
            };
            this.change_ds_pack();
        }else if(this.command == "input_name"){
            if(this.do_consoleflg){
                console.log(`in%c【INPUT_NAME】`,`color:green`);
            };
            this.input_name();
        }else if(this.command == "input_birth_day"){
            if(this.do_consoleflg){
                console.log(`in%c【INPUT_BIRTH_DAY】`,`color:green`);
            };
            this.input_birth_day();
        }else if(this.command == "link"){
            if(this.do_consoleflg){
                console.log(`in%c【LINK】`,`color:green`);
            };
            this.link();
        }else if(this.command == "load"){
            if(this.do_consoleflg){
                console.log(`in%c【LOAD_DIALOGUE_4START】`,`color:green`);
            };
            this.load_dialogue_4start();
        }else if(this.command == "judge_id"){
            if(this.do_consoleflg){
                console.log(`in%c【JUDGE_ID】`,`color:green`);
            };
            this.judge_id();
        }else if(this.command == "save"){
            if(this.do_consoleflg){
                console.log(`in%c【SAVE_DATA】`,`color:green`);
            };
            this.save_data();
        }else if(this.command == "book_uranai"){
            if(this.do_consoleflg){
                console.log(`in%c【BOOK_URANAI】`,`color:green`);
              
            };
            this.book_uranai();
        

        }else if(this.command == "judge_book"){
            if(this.do_consoleflg){
                console.log(`in%c【JUDGE_BOOK】`,`color:green`);
            };
            this.judge_book();
        
        }else if(this.command == "choose_fortune_teller"){
            if(this.do_consoleflg){
                console.log(`in%c【CHOOSE_FORTUNE_TELLER】`,`color:green`);
            };
            this.choose_fortune_teller();
        }else if(this.command == "uranai"){
            if(this.do_consoleflg){
                console.log(`in%c【URANAI】`,`color:green`);
            };
            this.uranai();
        }else if(this.command == "call_booked_fortune_teller"){
            if(this.do_consoleflg){
                console.log(`in%c【call_booked_fortune_teller】`,`color:green`);
            };
            this.call_booked_fortune_teller();
        }else if(this.command == "judge_isbooked"){
            if(this.do_consoleflg){
                console.log(`in%c【JUDEGE_ISBOOKED】`,`color:green`);
            };
            this.judge_isbooked();
        }else if(this.command == "select_uranai_l"){
            if(this.do_consoleflg){
                console.log(`in%c【SELECT URANAI L】`,`color:green`);
            };
            this.select_uranai("left");
        }else if(this.command == "select_uranai_r"){
            if(this.do_consoleflg){
                console.log(`in%c【SELECT URANAI R】`,`color:green`);
            };
            this.select_uranai("right");
        }
        else{
            alert("it is out of command. orderboxの書き方に異常があります。");
        }// end of if

        this.show_log_4debug();//デバッグ用のconsole.log表示
        
    }

    show_log_4debug(){//console.logに表示させるための機能

        
        //############パックのテーブル表示#################
        var do_you_wanna_see_table = 0;//ここで調節。１なら表示。０なら非表示

        if(do_you_wanna_see_table==1){
            this.dialogue_set4log = this.dialogue_set;
            this.orders_list4log = this.orders;
        }
        //###############################################

        var font_dict = new Map();
        font_dict.set(0,`color:black;font-weight:normal`);//非太字、黒色にする記述
        font_dict.set(1,`color:red;font-weight:bold`);//太字、赤色にする記述

        /** ===========  会話についてのログ製作 ===============**/
        if(this.dialogue_changed_flg==1 || this.dialogue_changed_flg==2){//flg 1=会話変更、 2=命令実行後に会話変更予定、 0=会話変更なし
            if(this.dialogue_set[this.dialogue_index]===undefined){//undefinedは次の会話ログが無い場合に取得されます
                var message = ` 会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。 会話もフキダシの文に更新されました。 %c現在、表示されている会話が最後の会話文です%c%c%c。 `     
                var dialogue_logfont_pattern = [1,0,1,0,0,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
            }else{
                if(this.command == "check_<change_d&s_index>"){//確認する（任意の場所へ移動）は表示する会話が二通りあるので　別処理
                    var raw_dialogueindex = this.orders[this.order_index][1];//会話インデックス番号
                  
                    var dialogue_of_yes = this.dialogue_set[this.dialogue_index];
                    var dialogue_of_no = this.dialogue_set[raw_dialogueindex];
                    var message = `会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。会話もフキダシの文に更新されました。次は　はいの場合 %c${dialogue_of_yes}%cを。いいえの場合、%c${dialogue_of_no}%cをフキダシに表示されます。`
                }else{//通常の処理
                    var message = `会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。会話もフキダシの文に更新されました。次は %c${this.dialogue_set[this.dialogue_index]}%cをフキダシに表示されます。%c%c`
                }
                    var dialogue_logfont_pattern = [1,0,1,0,1,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
            }
            
        }else{//会話ログが次ない場合
            var message = `今回、%c%c%c会話文は変更されてません%c%c%c。`
            var dialogue_logfont_pattern = [0,0,1,0,0,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }

        if(this.order_changed_flg==1){//flg=1は　命令完了
            try{
                var order_messasge = `「%c${this.command}%c」を実行しました。命令インデックス番号は「%c${this.order_index}%c」に変わりました。次は「%c${this.orders[this.order_index][[0]]}%c」を実行します。%c%c`
            }catch(error){
                var order_messasge = `「%c${this.command}%c」を実行しました。%cこれが最後の命令です%c%c%c%c%c`
            }
            var order_logfont_pattern = [1,0,1,0,1,0,0,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }else if(this.order_changed_flg==2){//flg=2はボタン入力待ち等　実行待ち
            if(this.command == "check_<change_d&s_index>"){//確認する（任意の場所へ移動）は命令が二つ設定されているため別処理。
                var raw_orderindex = this.orders[this.order_index][1];//命令
                var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次ははいの場合「%c${this.orders[this.order_index+1][[0]]}%c」、いいえの場合「%cto_関数を実行後、${this.orders[raw_orderindex][0]}%c」を実行します。`
            }else{//通常処理
                try{//次の命令がある場合の処理
                    var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次は「%c${this.orders[this.order_index+1][[0]]}%c」を実行します。%c%c`
                }catch(error){//次の命令がない場合、undefinedを読み込みエラーとなる。
                    var order_messasge = `「%c${this.command}%c」の実行待機中です。%cこれがこの命令パック最後の命令です%c%c%c%c%c。`
                }
            }
            
            var order_logfont_pattern = [1,0,1,0,1,0,1,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }
        else{//命令が無かった場合
            var order_messasge = `「%c%c%c%c%c命令インデックス番号に変化はありません%c%c%c。`
            var order_logfont_pattern = [0,0,0,0,1,0,0,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }

        console.log(`%c【do実行後】%c;
        【%c命令%c: ${order_messasge}】
        【%c会話%c: ${message}】`,
                            `font-weight:bold;`,`font-weight:normal;`,
            `font-weight:bold;`,`font-weight:normal;`,font_dict.get(order_logfont_pattern[0]),font_dict.get(order_logfont_pattern[1]),font_dict.get(order_logfont_pattern[2]),font_dict.get(order_logfont_pattern[3]),font_dict.get(order_logfont_pattern[4]),font_dict.get(order_logfont_pattern[5]),font_dict.get(order_logfont_pattern[6]),font_dict.get(order_logfont_pattern[7]),
            `font-weight:bold;`,`font-weight:normal;`,font_dict.get(dialogue_logfont_pattern[0]),font_dict.get(dialogue_logfont_pattern[1]),font_dict.get(dialogue_logfont_pattern[2]),font_dict.get(dialogue_logfont_pattern[3]),font_dict.get(dialogue_logfont_pattern[4]),font_dict.get(dialogue_logfont_pattern[5]),
        );

        if(do_you_wanna_see_table){
            console.table(this.orders_list4log);
            console.table(this.dialogue_set4log);
        }
        this.dialogue_changed_flg = 0;//会話が切り替わった指標を初期化する
        this.order_changed_flg = 0;//命令が実行された指標を初期化する
    }

    is_logined(){//cookieを参照し、ログイン済みかを判定する データ取得するものはここに書く
        //this.order_arg = 未ログインの場合の命令ボックス
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<IS_LOGINED>>`,`color:blue`);
        };
        
        get(this.cookie_dbRef).then((snapshot) => {//page2, letter.indexの時のデータ取り出し
           
            if (snapshot.exists()) {//パスワードが登録されていた場合
                var data_list = snapshot.val();//データを格納[DATE,"passward"]
                data_list = JSON.parse(data_list);

                let cookie_date = new Date(data_list[0]); // cookie_dateを格納
                let current_date = new Date(); // 現在の時刻を取得

                // cookie_dateから現在時刻までの経過時間をミリ秒で取得
                let elapsed_time = current_date - cookie_date; 
                console.log(`elapsed time is ${elapsed_time}. current date[${current_date}]- cookie_date[${cookie_date}]`);
                // 3秒（3000ミリ秒）経過したか判定
                if (elapsed_time >= 3000) {
                    data_list = [];
                    console.log("over 3 sec")
                } else {
                    data_list = data_list[1];
                    console.log(`get passward ${this.passward}`)
                }

            
            } else {//パスワードが存在しなかった場合
                data_list = [];
                console.log("error: non available passward, in get_userdata");
            }
            
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            if(data_list.length> 1){

                this.user_name =data_list[0]         // 0:ユーザー名
                this.birth_day =data_list[1]         // 1:ユーザーの誕生日
               
                //ここでもうデータを取り出してしまう
    
      
                this.dialogue_set = this.orderbox_logined[0];
                this.orders = this.orderbox_logined[1];
    
                this.order_index = 0;
                this.dialogue_index = 0;
                try{
                    
                    this.do();
                }catch(error){
                    alert(`${error.message}\n\n${error.stack}`)
                }
                
                
            }else{
                this.dialogue_set = this.orderbox_unlogined[0];
                this.orders = this.orderbox_unlogined[1];
                
    
                this.order_index = 0;
                this.dialogue_index = 0;
                try{
                    this.do();
                }catch(error){
                    alert(`${error.message}\n\n${error.stack}`)
                }
            }
        });

        


    }

    load_dialogue_4start(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LOAD_DIALOGUE_4START>>`,`color:blue`);
        };


        //会話パックの最初のログを読み込むための関数。
        this.load_dialogue();
        //ログを読み込む

        this.btn1.textContent = "次へ";
        this.btn2.textContent = "ー";
        //ここが開始時のみの記述
        //ボタンの表示設定

        this.btn1.addEventListener("click",()=>{
            this.do();
        },{once:true});
        //ボタン１にイベント設定。

        this.dialogue_index += 1;
        //会話インデックスを更新分、１つ増加
        this.order_index += 1;
        this.order_changed_flg = 1;
        //命令を終えたため、命令インデックスを一つ増加

  

    }

    load_dialogue(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LOAD_DIALOGUE>>`,`color:blue`);
        };
        //引数はなし

        this.contents_of_speech = this.dialogue_set[this.dialogue_index];
        //dialogue_indexは会話パックのインデックス番号である。
        //会話パックdialogue_setから、インデックス番号を使って会話を取り出す

        this.translate_command();//#command#の分析・読み取り・置換        
       
        this.speech.innerHTML = this.contents_of_speech;
        
        this.dialogue_changed_flg = 1;//会話を変えたことを記録

    }

    translate_command(){//this.contents_of_speechに文字列を入れる。その後実行、return:this.contents_of_speech
        //<command>分析・読み取り・置換

        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TRANSLATE_COMMAND>>`,`color:blue`);
        };
        
        var regex = /#([^#]+)#/g;
        var match;
        var string_command_list = [];
        while ((match = regex.exec(this.contents_of_speech)) !== null) {
            string_command_list.push(match);
        }

        string_command_list.forEach(command =>{//コマンド式テンプレートリテラル法
            
            switch(command[1]){//ここに、処理するコマンドを書く
                case "command_user_name":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_user_name#",this.user_name);
                    
                case "command_birth_day":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_birth_day#",this.birth_day);
                
                case "command_booked_uranai":
                    
                    this.contents_of_speech = this.contents_of_speech.replace("#command_booked_uranai#",this.booked_fortuneteller_name);
            }
        });        
    }

    next_dialogue(){
        //引数はなし
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<NEXT_DIALOGUE>>`,`color:blue`);
        };
       
        var next_order =this.orders[this.order_index][0];
        
        this.btn1.textContent = "次へ";
        this.btn2.textContent = "ー";
        //ボタンの表示設定

        if(next_order == "check_ds_index" || next_order == "check_ds_pack"){           
            this.do();

            //次の命令がcheckの場合は、ボタンセットを表示させるcheck命令を実行させる
        }else{
            
            this.btn1.addEventListener("click", () =>{
                this.do();                
            }, { once: true });
            //speechへのイベント設定は next_order="check"の時はしません。
            //してしまうと、speechのイベントが二重になります。
            //そしてシステムの一大バグ「なぜか会話が一つ飛び」(格闘4時間）を引き起こしてしまいます。
        }
       
        
        this.load_dialogue();
        //会話文を更新     

        this.dialogue_index += 1;
        //会話パックのインデックス番号を増加
       
        
        this.order_index += 1;
        this.order_changed_flg = 1;
        //命令を一つ終えたため、命令インデックスを１つ増加
    }

    to_dialogue(){//【to_関数　手順➀】
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TO_DIALOGUE>>`,`color:blue`);
        };
        var second_order_arg = this.order[2];
    
        //任意の会話インデックス値を取得

        this.dialogue_index = second_order_arg;
        //任意の会話になるように、会話インデックス番号を変更
        //必ずto_order()命令インデックス指定関数も一緒に実行してください。
     
        this.load_dialogue();
 
    }

    to_order(){//【to_関数　手順➁】     
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TO_ORDER>>`,`color:blue`);
        };
        this.order_index = parseInt(this.order_arg);
        this.order_changed_flg = 1;
        //任意の命令になるように、命令インデックス番号を変更
        this.do();
        //更新された命令インデックス番号によって、命令を更新
    } 

    check_change_ds_index(){//checkの分岐によって、会話パックのインデックス番号を変える命令です
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<CHECK_CHANGE_DS_INDEX>>`,`color:blue`);
        };
        //arg1:to_order用　　arg2:to_dialogue用

        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = "はい"
        this.btn2.textContent = "いいえ"
        //ボタンの表示設定
        //btn等の設定

        this.contents_of_speech = this.order[3];
        this.translate_command();
        
        this.speech.innerHTML = this.contents_of_speech;//表示する文
        
       var now_functions_index = this.func_CHANGE_DS_INDEX_index + 1;
        this.btn1.addEventListener("click", ()=> {
         
            if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない

                this.order_index += 1;
                this.do();
            }
            //【はい】を押した場合のイベント
        },{once:true});     

        this.btn2.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                this.btn1.textContent = "次へ"
                this.btn2.textContent = "ー"

                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない
                this.to_dialogue();
                //任意の会話に設定して、ロード
                this.to_order();
                //任意の命令に設定して、実行
            }
            //【いいえ】を押した時のイベント
        },{once:true});   
        
        this.dialogue_changed_flg =2;
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に


        this.func_CHANGE_DS_INDEX_index += 1; //関数内インデックスを増加
    }

    change_ds_pack(){//ボタンの分岐によって、会話・命令パックを切り替える命令ですa
        //this.order_arg = btn1の時のパック
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<CHANGE_DS_PACK>>`,`color:blue`);
        };
        var second_order_arg = this.order[2];//btn1のボタン表示
        var third_order_arg = this.order[3];//btn2の時のパック
        var fourth_order_arg = this.order[4];//btn2のボタン表示
        var fifth_order_arg = this.order[5];//分岐時に表示する文

        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = second_order_arg;
        this.btn2.textContent = fourth_order_arg;
        //ボタンの表示設定
        //btn等の設定

        this.contents_of_speech =  fifth_order_arg;
        this.translate_command();//#command#がある場合に、処理を行う。
        this.speech.innerHTML = this.contents_of_speech;//分岐時の文を表示する
                                    
        
        var now_functions_index = this.func_CHANGE_DS_PACK_index + 1;
        //+1をするのは、関数実行後にthis.func_CHANGE**が１つ増加するため。

        //alert("changedspack")
        this.btn1.addEventListener("click", ()=>{
  
            if(this.order[0]=="change_d&s_pack"&& now_functions_index == this.func_CHANGE_DS_PACK_index){
            this.dialogue_index = 0;
            this.order_index = 0;
            //console.log(`？＋？＋it is next. order_index is ${this.order_index}. dialogue is ${this.dialogue_set[this.dialogue_index]}`)
            //命令ボックスを移行するため、すべてのインデックス番号を初期化
            this.dialogue_set = this.order_arg[0];
            this.orders  = this.order_arg[1];
                
            //新しい命令ボックスから、それぞれ会話パック、命令パックを取り出し、更新。
            
            this.do();
            //画面を更新
        }
        },{once:true});

        this.btn2.addEventListener("click", ()=>{
  
            if(this.order[0]=="change_d&s_pack"&& now_functions_index == this.func_CHANGE_DS_PACK_index){
                this.dialogue_index = 0;
                this.order_index = 0;
                //命令ボックスを移行するため、すべてのインデックス番号を初期化
                this.dialogue_set = third_order_arg[0];
                this.orders  = third_order_arg[1];
               //新しい命令ボックスから、それぞれ会話パック、命令パックを取り出し、更新。
                this.do();
                //画面を更新
            }
        },{once:true});
        
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
        
        this.func_CHANGE_DS_PACK_index += 1; //関数内インデックスを増加
    }

    link(){//≪データ記入場≫
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LINK>>`,`color:blue`);
        };

        var user_data = [
            this.user_name,             // 0:ユーザー名
            this.birth_day,             // 1:ユーザーの誕生日
            this.booked_fortuneteller   //  2:予約した占い師名
        ]

        const expires = new Date();
        expires.setTime(expires.getTime() + 2000);//2000

        var cookie_list = [expires,user_data];
        cookie_list = JSON.stringify(cookie_list);
        set(this.cookie_dbRef,cookie_list);//firebaseにデータを記録

        window.location.href = this.order_arg;
        this.order_changed_flg = 1;
        //引数にあるhtmlリンクを表示させる
    }

    input_name(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<INPUT_NAME>>`,`color:blue`);
        };

        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "text");
        this.btn1.textContent =  "確定";
        this.btn2.textContent = "ー";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() => {
            //alert("PRESSED BTN1 IN INPUT NAME");
            this.user_name = this.entry.value;
            //entryに入力されたデータをkey=nameとしてローカルストレージに保存
            
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        this.order_changed_flg  = 2;////ボタン押してもらうので、待機中判定に
        
    }

    input_birth_day(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<INPUT_BIRTH_DAY>>`,`color:blue`);
        };

        try {

            this.entry.setAttribute("type", "date");
            if (this.entry.type !== "date") {
              throw new Error("date type not supported");
            }
          } catch (error) {
            // Safariなど`type="date"`が無効の場合にFlatpickrを適用
            // Flatpickrを初期化
            this.fp = flatpickr(this.entry, {
                dateFormat: "Y-m-d",
                defaultDate: new Date(),
                allowInput: true,
                altInput: true,
                altFormat: "Y-n-j",
            });
            
            
          }



        this.entry.placeholder = "";
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() =>{
            this.birth_day = this.entry.value;
            //alert(`PRESSED INPUT BIRTHDAY BTN, and arg is ${this.birth_day}`);
            console.log(`it is birthday ${this.birth_day}`);
            this.entry.value = ""
            this.entry.setAttribute("type","text")
            //entryに入力されたデータを初期化。お掃除です。
            
            try{
                // 後からaltInputを削除する
                if (this.fp.altInput) {
                    this.fp.altInput.remove(); // altInputの削除
                    this.fp.altInput = null; // 参照をクリア
                }
            }catch(error){

            }
            //一つ会話を進ませる
            this.order_index += 1;
            this.do();
        },{ once: true })
        
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }

    save_data(){//≪データ記入場≫ユーザー識別idを製作し、データを保存します.セーブする内容が増えたらこっちに記入を
        //this.order_arg = 表示する文
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<SAVE_DATA>>`,`color:blue`);
        };
        this.id = `${this.user_name}${this.birth_day}`;
  
        var user_data = [
            this.user_name,             // 0:ユーザー名
            this.birth_day             // 1:ユーザーの誕生日
        ]

        var JSON_datapack =  JSON.stringify(user_data);

        //const newPostRef = push(this.dbRef);//ユニークキーを生成する場合
        var dbRef =  ref(this.db, `data/${this.id}`);
        set(dbRef,JSON_datapack);//Google Firebaseにデータを保存（key, data）

        this.btn1.textContent =  "次へ";
        this.btn2.textContent =  "ー";

        this.contents_of_speech = this.order_arg;
        this.translate_command();
        this.speech.innerHTML = this.contents_of_speech;
        //#command#の翻訳


        this.btn1.addEventListener("click", ()=>{
            this.do();
        },{once:true});
        
        this.order_index += 1;

        this.dialogue_changed_flg = 1;
        this.order_changed_flg = 1;

        /*【以前のでーた】
        //保存するdictionaryの作成・取得
        if(window.localStorage.data == ""){
            var user_data_pack = new Map();
        }else{
            var raw_data = window.localStorage.getItem("data");
            var user_data_pack = new Map(JSON.parse(raw_data));
            //二回目以降は、localstorageにあるdictionaryにデータを追加していきます。
            //じゃないと、毎回dictionaryごと上書きしてしまうため。
            //複数人のデータが保存されません。
        }
   
        user_data_pack.set(this.id,user_data);
        var packed_object_map = JSON.stringify(Array.from(user_data_pack.entries()));
        //localStorageでは生のobject mapを保存できません。
        //そのため、JSON形式に変換して保存します。
        window.localStorage.data = packed_object_map;
        //データをストレージに保存

        */
    }

    get_userdata(){// ≪データ記入場≫他に取り出すものが増えたらここに忘れず記入
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<GET_USERDATA>>`,`color:blue`);
        };
        console.log(`$$$$$in get user data$$$$$$${this.user_name}`)


        this.id = `${this.user_name}${this.birth_day}`;
        var dbRef =  ref(this.db, `data/${this.id}`);
        get(dbRef).then((snapshot) => {//page2, letter.indexの時のデータ取り出し
           
            if (snapshot.exists()) {//パスワードが登録されていた場合
               
                var raw_data = snapshot.val();//データを格納[DATE,"passward"]
                this.user_savedata = JSON.parse(raw_data);
        
                //JSON形式のデータを取り出します
                //その後、JSON形式を解凍します。
                //そして、 data.get(id)でユーザーデータ（LIST型）を取り出せます。
                console.table(this.user_savedata);
                console.log(`=======================${this.id}`)
                try{
                    this.user_name = this.user_savedata[0]         // 0:ユーザー名
                    this.birth_day = this.user_savedata[1]         // 1:ユーザーの誕生日
                    
                    //ここでもうデータを取り出してしまう
                }catch(error){
                    this.user_name = "";
                    this.birth_day = "";

                }
            
            } else {//パスワードが存在しなかった場合
                this.user_savedata = [];
                console.log("error: non available passward, in get_userdata");
            }
        });

   
    }
    
    hub_judge(){//各種judge関数において、判定False時の処理
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<HUB_JUDEGE>> `,`color:blue`);
        };

        //this.order_arg = 判定がfalse時に表示する文字
        var second_order_arg = this.order[2]; //移行する命令インデックス番号
        var third_order_arg = this.order[3]; //移行する会話インデックス番号
        this.speech.innerHTML = this.order_arg;
        this.dialogue_index  = third_order_arg;
        this.order_index = second_order_arg;

        this.dialogue_changed_flg = 1;//会話の変化を記録
        
        this.btn1.addEventListener("click", ()=>{
            this.do();
        },{once:true});

        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定
    }

    judge_id(){//id判定。
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<JUDGE_ID>>`,`color:blue`);
        };

        //this.get_userdata();//入力された名前と生年月日でidを製作。いったん取り出してみる
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<GET_USERDATA>>`,`color:blue`);
        };
        console.log(`$$$$$in get user data$$$$$$${this.user_name}`)


        this.id = `${this.user_name}${this.birth_day}`;
        if(this.id == ""){
            this.id = "empty";
        }
        var dbRef =  ref(this.db, `data/${this.id}`);
        get(dbRef).then((snapshot) => {//page2, letter.indexの時のデータ取り出し
           
            if (snapshot.exists()) {//パスワードが登録されていた場合
               
                var raw_data = snapshot.val();//データを格納[DATE,"passward"]
                this.user_savedata = JSON.parse(raw_data);
        
                //JSON形式のデータを取り出します
                //その後、JSON形式を解凍します。
                //そして、 data.get(id)でユーザーデータ（LIST型）を取り出せます。
                console.table(this.user_savedata);
                console.log(`=======================${this.id}`)
                try{
                    this.user_name = this.user_savedata[0]         // 0:ユーザー名
                    this.birth_day = this.user_savedata[1]         // 1:ユーザーの誕生日
                    
                    //ここでもうデータを取り出してしまう
                }catch(error){
                    this.user_name = "";
                    this.birth_day = "";

                }
            
            } else {//パスワードが存在しなかった場合
                this.user_savedata = [];
                console.log("error: non available passward, in get_userdata");
            }
            //===================================================================================
            this.btn1.textContent = "次へ";
            this.btn2.textContent = "ー";
       
            
            
            try{
                var id_data = this.user_savedata[0]
            }
            catch(error){
                var id_data = "nothing";
            };
    
    
            if(id_data == "nothing" || id_data === undefined){//idが登録されてなかったら、undefinedになる。
              this.hub_judge();
            }else{//占い師の名前が確認された場合
    
                this.next_dialogue();
                //next_dialogueでorder_indexとorder_changed_flg変更するから
                //ここでは記述しないこと。
            }
        });


        
    }

    back_to_home(){//➡this.linkへ
        this.order_arg = "index.html";
        this.link();
    }

    //######################占いの館専用関数##########################

    select_uranai(arg){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<SELECT URANAI>>`,`color:blue`);
        };
        var arg = arg;//leftかrightか
        
        this.in_select_uranai = true;

        this.speech.innerHTML = this.order_arg;//表示文を表示

        this.pic1 = document.getElementById("booking_1");//◎〇〇〇　写真位置（◎がpic1)
        this.pic2 = document.getElementById("booking_2");//〇◎〇〇　写真位置（◎がpic2）
        this.pic3 = document.getElementById("booking_3");//〇〇◎〇　写真位置（◎がpic3)
        this.pic4 = document.getElementById("booking_4");//〇〇〇◎　写真位置（◎がpic4)

        if(arg == "left"){
            this.pic1.src = "lamia.jpg";//恋愛
            this.pic2.src = "burokkori.jpg";//ブロッコリー
            this.pic3.src = "apep.jpg";//金運
            this.pic4.src = "hydra.jpg";//仕事

            this.pic_lists = [
                ["lamia.jpg" , "ラミア―"],
                ["burokkori.jpg" , "ブロッコリー"],
                [ "apep.jpg", "アペプ"],
                [ "hydra.jpg" , "ヒュドラ"]
            ]

        }else if(arg == "right"){
            
            this.pic1.src = "keiryu.jpg";//学業
            this.pic2.src = "itzamna.jpg";//健康
            this.pic3.src = "basilisk.jpg";//人間関係
            this.pic4.src = "usatyann.jpg";//うさちゃん
        
            this.pic_lists = [
                ["keiryu.jpg" ,"ケーリュ"],
                ["itzamna.jpg","すこやか"],
                ["basilisk.jpg" , "バシリスク"],
                [ "usatyann.jpg" ,"うさちゃん"]
            ]
        }

        this.entry.placeholder = "占い師の名前を入力";


        this.pic1.addEventListener("click", ()=>{

            this.entry.value = this.pic_lists[0][1]; 
         });
         this.pic2.addEventListener("click", ()=>{
            this.entry.value = this.pic_lists[1][1]; 
          });
         this.pic3.addEventListener("click", ()=>{
            this.entry.value = this.pic_lists[2][1];  
         });
         this.pic4.addEventListener("click", ()=>{
            this.entry.value = this.pic_lists[3][1];  
         });
         //画像をクリックするだけでentryに入力するようにする。

         this.btn1.textContent = "決定";
         this.btn1.addEventListener("click",()=>{
            this.order_index += 1;
            this.do();           
         },{once:true});
 
         this.btn2.textContent = "戻る";
         this.btn2.addEventListener("click",()=>{
            if(this.in_select_uranai==true){
                this.back_to_home();
            }   
         },{once:true})

    }

    judge_book(){//占い師が予約可能か判定
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<JUDGE_BOOK>>`,`color:blue`);
        };

        this.btn1.textContent = "次へ";
        this.btn2.textContent = "ー";


        var user_input = this.entry.value;
        var flg = false;

        for(let i = 0; i <= 3; i++){
            if(user_input == this.pic_lists[i][1]){
                flg = true;
                this.selected_fortune_teller = this.pic_lists[i][0];
                break;
            }
        };


        if(flg == true){
            this.entry.value = "";
            this.entry.placeholder = "";
            this.order_index += 1;
            this.order_changed_flg = 1;  
            this.do();
        }else{
            this.hub_judge();
            this.entry.value = "";
        }
    }

   
    call_booked_fortune_teller(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<CALL_BOOKED_FORTUNE_TELLER>>`,`color:blue`);
        };

        var fortune_teller_box = window.localStorage.getItem("dict_fortune_tellerbox");
        //JSON加工されたdictionaryを取得
        fortune_teller_box  =  new Map(JSON.parse(fortune_teller_box));
        //JSONを解凍
        console.table(fortune_teller_box);
        console.log(`it is selected. ${this.selected_fortune_teller}`);
        fortune_teller_box = fortune_teller_box.get(this.selected_fortune_teller);

        this.pic_of_fortune_teller = document.getElementById("pic_receptionist");
        this.pic_of_fortune_teller.src = this.selected_fortune_teller;

        this.pic1.src = "forbooking.png";
        this.pic2.src = "forbooking.png";
        this.pic3.src = "forbooking.png";
        this.pic4.src = "forbooking.png";

        this.dialogue_set = fortune_teller_box[0];
        this.orders = fortune_teller_box[1];
        this.order_index = 0;
        this.dialogue_index = 0;
        this.order_changed_flg = 1;
        this.do();


    }

    uranai(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<URANAI>`,`color:blue`);
        };

        this.modal = document.getElementById("modal");
        this.modal.style.display = "flex";

        this.uranai_fix_ind = this.birth_day.match(/\d+/g) // 全ての数字を抽出
        if (this.uranai_fix_ind) {
            this.uranai_fix_ind = this.uranai_fix_ind.join(''); // 数字を結合
        }else{
            this.uranai_fix_ind = "";
        }     

        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1; // 月は0始まり
        var day = today.getDate();
      
        // 今日の日付をフォーマット（例: "2025-1-4" -> "202514"）
        var formattedDate = `${year}${month}${day}`;

        this.uranai_fix_ind = this.uranai_fix_ind + formattedDate;
        
        this.speech.innerHTML = "";

        switch(this.order_arg){
            case "health":
                this.uranai_health();
                break;
            case "gold":
                this.uranai_gold();
                break;
            case "work":
                this.uranai_work();
                break;
            case "relationship":
                this.uranai_relationship();
                break;
            case "study":
                this.uranai_study();
                break;
            case "love":
                this.uranai_love();
                break;
            case "burokkori":
                this.uranai_burokkori();
                break;
            case "usatyann":
                this.uranai_usatyann();
                break;

        }

        this.btn1.addEventListener("click",()=>{
            this.modal.style.display = "none";
            this.do()
        },{once:true});
        this.order_changed_flg = 2;
        this.dialogue_changed_flg = 1;
        this.order_index += 1;
    }

    uranai_health(){
        var list_luckyitems = ["トマト",
            "味噌汁",
            "生姜",
            "ハチミツ",
            "柚子",
            "キャベツの千切り",
            "のど飴",
            "マスク",
            "ハンドソープ",
            "野草",
            "グルテンフリー",
            "砂糖がない飲食物",
            "太陽光",
            "スマホ以外のもの",
            "ほうじ茶",
            "緑茶",
            "カフェインが無いもの",
            "梅干し",
            "リンゴ",
            "黒酢",
            "心地よい香り",
            "水",
            "アルコール０％のもの",
            "魚",
            "野菜",
            "サツマイモ"
        ];
        var list_result = [
            "怪我をしやすい一日となるでしょう。<br>普段は気にしないような所でも周りに注意をして、転ばないように・ぶつからないようにしましょう。",
            "快調な一日となるでしょう。<br>今日は朝日を浴びて、適度に運動をすれば　明日にかけても健康になるでしょう。",
            "まあまあな一日となるでしょう。<br>明日にかけて体調が悪くならないよう　今日は健康に気を使いましょう。",
            "調子が良い一日となるでしょう。<br>さらに健康になるために、早起き早寝をしてみましょう。すると、体内時計が正しくなりホルモンバランスが整います。",
            "免疫が下がる一日になるでしょう。<br>そんな今日は手洗いうがいを忘れずに。そして、ハチミツ＋山盛り生姜＋ビタミンCが豊富な飲食物を混ぜて飲むと明日にかけて健康になるでしょう。"
        ]

        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>そんなあなたの健康度を上げるラッキーアイテムは${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}です。`
        
        this.modal.innerHTML = result;
    }

    uranai_gold(){
        var list_luckyitems = ["半額シール",
            "ギザギザ１０円",
            "新千円札",
            "５円玉",
            "四角いもの",
            "エコバック",
            "エコ素材",
            "マイボトル",
            "非プラスチック",
            "自家製食品",
            "自炊",
            "常連のお店",
            "おまけ付き",
            "野菜の種",
            "最近使ってないサブスクリプション",
            "自制の精神",
            "オーストラリアの1ドル硬貨(金色)"
        ];
        var list_result = [
            "今日の金運は悪いでしょう。今日は貯金の日です。節制を心がけ、明日以降に備えましょう。１００円でも１０日積み重なれば１０００円となります。",
            "とてもよい一日となるでしょう。何か良い買い物ができる日です。",
            "まあまあな運勢でしょう。いつも通りの生活を送りましょう。",
            "よい一日となるでしょう。こんな日には誰かに花をプレゼントする心持があれば今後も金運が上がっていきます",
            "運気が下がり気味の一日となるでしょう。今日は大きな買い物は失敗しやすいです。まがい物を買ってしまうかもしれません。"
        ]

        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>そんなあなたの金運を上げるラッキーアイテムは${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}です。`
        
        this.modal.innerHTML = result;
    }

    uranai_work(){
        var list_story = [
            "迷えば薪刈り人にも、草刈り人にも聞く。<br>『詩経』",
            "身が修まれば国は乱れない。<br>「詹何」",
            "明君は衆人の意見を博く聞く。暗君は偏って信用する。<br>『貞観政要』",
            "驕りの始めれば、存亡の危機に立つ。<br>『貞観政要』",
            "殷鑑遠からず。戒めとなる手本は近くにある。歴史を鏡にすれば物事の盛衰がわかる。<br>『貞観政要』",
            "木を成長させる者は必ず根元を固め、水を遠くまで流す者は必ずその水源を深くする。<br>『貞観政要』",
            "民が怨むのは物事の大小でなく人君の道理にある。<br>『書経』",
            "隋の文帝は全ての案件を一人で捌いた。しかし、10の案件をこなせば5つは道理に当たらない。何年も積み重なれば国は滅亡する<br>『貞観政要』",
            "病人は治ったと思った時こそ、いよいよ養生しなければならない。天下が安泰になった時こそ、最も恐れ慎まなければならない。<br>『貞観政要』",
            "民は水である。君は船である。水は船を載せる。また水は船を転覆させる。<br>『荀子』",
            "大事は全て小事から起こる<br>『貞観政要』",
            "昔、晋の文公は狩りに出かけて、遠く離れた沼地に入り道に迷った。そこで漁師と出会った。文公は漁師に「私はそなたの君主である。道案内をしてくれれば褒美を取らせる」と言った。ようやく抜け出して文公は漁師の名を書き留めるよう従者に命じた。しかし、漁師は「なぜ私の名を知る必要があるでしょうか。君主が国内を保ち、万民を慈愛し、労役や租税を軽くすれば、私もその恩恵をあずかりましょう。もし君主が国内をしっかりと治めず、外に対しては諸侯に無礼な態度をとり、内では人民の気持ちに逆らい、国中がさまよえば私のような漁師は褒美をもらったとしても、それを持ち続けることはできません。」と言い、とうとう褒美を受け取らなかった。<br>『新序』",
            "君主が静かで安らかであれば、人民は安楽とならないはずがない。<br>『貞観政要』",
            "銅を鏡とすれば身なりを正せる。昔を鏡にすれば国の興亡や盛衰を知ることができる。人を鏡とすれば自分の良い点、悪い点を明らかにできる。<br>『貞観政要』",
            "君主が己の過ちを知ろうとすれば、必ず忠臣の意見に頼らねばならない。しかし、君主が自分を賢者と思い込めば、臣下は君主の過ちを正そうとはしなくなる。隋の煬帝はこうして滅びた<br>『貞観政要』",
            "盲人が危ない時に手を取らず、転んでも助け起こさないのなら、付き添いなど要らない。国が滅びないように助けず、君主にゴマをする臣下では国は滅びる。臣下が君主を諌めたり、進言することで君主も国も安寧となる。<br>『貞観政要』",
            "君主が臣下の言葉に怒り叱責すれば、君主を諌めようとする者は、もはやいなくなる<br>『貞観政要』",
            "臣下の諫言（相手の欠点を指摘し、正すこと）は明るい鏡のように、君主の美も醜もはっきりと映す<br>『貞観政要』",
            "最初の兆しを諌めなければ、「すでに着手してしまったから」「もう許可してしまったから」といって、結局止めたり、改められることはない。これでは、国家滅亡の災難があっというまに訪れる<br>『貞観政要』",
            "昔、斉の垣公が郭（かく）という国にいった時、土地の父老に「郭はどうして滅びたのか」と尋ねた。父老が「郭の君主は、善を善として、悪を悪としたからです」と答えた。垣公はさらに、「そなたの言うとおりなら郭君は賢君ではないか。どうして滅亡にいたったのか」と問い直した。すると父老は「賢君ではありません。郭君は善を善としましたが、その善を用いることができず、悪を取り去ることができませんでした。だから滅んだのです」と答えた。<br>『菅子』",
            "君主は頭で、臣下は手足であります。身体が備わってなければ、人となることはできません。頭が上にあっても、手足があって初めて身体となります。君主が優れていても、手足となる臣下によって初めて世を治めることができます。<br>『貞観政要』;魏徴",
            "鉄鋼王 Andrew Carnegieを知っているか？19世紀にアメリカの1/4もの鋼を生産し、世界一の富豪になった男だ。<br>　彼は「人の名前」の価値を知っていたことが、成功の秘訣とも言われている。それを彼は子どもの時に学んだ。<br><br>ある日、カーネギー少年は野兎をこっそり飼っていた。だが、カーネギー少年は与える餌をもっていない。そこで考えた。「もし、クローバーとタンポポを沢山持ってきた人には、あなたの名前をこの兎に名付けよう」と友だちに言ったのだ。これは抜群にうまくいった。<br><br>この経験が忘れられなかったカーネギーは、後々、事業を拡大するときにこの技術をつかった。交渉として営業先の会社＜Pullman>にこう言ったのだ。「一緒に出資して、車会社を作らないか。もちろん社名はPullman車会社で」。ライバルであり、難航すると思われた交渉はすぐに終わった。「部屋に入って、詳しく話そうじゃないか」pullmanは笑顔でカーネギーに言い、かのプルマンが誕生したのだ<br>出典『How to win friends and influence people』;1章3節",
            "君主が臣下を自分の手足のように扱えば、臣下は君主を自分の腹や胸のように思う。しかし、臣下を犬や馬のように扱えば、臣下は君主を通りすがりの人のように思う。もし臣下を糞や土のように扱えば、臣下は君主を仇敵のように怨む。<br>『孟子』"
        
        ];

        var list_result = [
           "今日の仕事運は少し不安定な状況です。小さなミスが発生しやすくなるかもしれません。普段よりも慎重に、丁寧に取り組むことが重要です。そうすれば、ミスは避けられるでしょう。",
            "今日は非常に良い一日となる予感です。仕事が順調に進み、全てがスムーズに運ぶでしょう。また、新しいプロジェクトや事業を始めるには絶好のチャンスです。",
            "今日の運勢はまぁまぁな感じですね。無理せず、一歩ずつ着実に進んでいくことが大切です。休憩も適宜取って、しっかりとリフレッシュしながら進めましょう。",
            "今日は順調に進む一日になるでしょう。多くのことが予定通りに終わり、特に問題なく業務をこなせる日です。",
            "今日は運勢が少し悪いかもしれません。日々の疲れが溜まっている可能性が高いです。こんな日は無理せず、自分をしっかりと労わり、休養を取ることをおすすめします。",
        ]

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>そんなあなたの為に運気をあげる古語を送りましょう。<br>＝＝＝＝＝＝＝＝＝＝＝<br>　${list_story[this.uranai_fix_ind % list_story.length]}<br>＝＝＝＝＝＝＝＝＝＝＝<br><br>良い一日となりますように。`
        
        this.modal.innerHTML = result;
    }

    uranai_relationship(){
        var list_story = [
            "人は自分にしか興味がない。だから、自分に興味を持ってくれた人のことが好きになる。<br>何か仲良くなりたい・交渉したいなら、まずその人に興味をもつことが大切だ。そしたら相手も私に興味をもってくれる。<br>出典『How to win friends and influence people』;1章1節",
            "ほほえみが人生を変えたことがある。ある男のお話をしよう。<br>　ニューヨークに株式仲介人として働く男がいた。彼は18年連れ添った妻がいる。しかし、最近はまったく妻に対して笑顔を見せていない。ニューヨークの夫婦で一番、不愛想な夫だと自負していた。<br>　ある日、彼はこの生活に悩みカーネギ氏の講演に参加した。そこで彼は「笑顔の大切さ」を学んだ。さっそく家で妻に微笑んでみた。妻は彼を見て驚き、「どうしたの」ってうろたえてたさ。この日から、彼は毎朝妻に微笑むことにした。そうしたら、どんどん家庭がこれまで以上に幸せに包まれた。<br>　これを職場でも彼はやってみた。すると、いつもより取引が順調に成功していったんだ。彼は「笑顔が毎日、毎日お金を運んでくれた」と言っている。笑顔でより幸せで、豊かな男になったのだ<br>出典『How to win friends and influence people』;1章2節",
            "笑顔は人生を豊かにする。行動と感情は一緒にうごく。幸せは外から来るんじゃない。笑顔になることで内から沸いてくる。ただ、作り笑いをするだけで　不思議と幸せな気分となり、人生は豊かになり、人間関係も豊かになる。<br>出典『How to win friends and influence people』;1章2節",
            "なりたい理想を想い浮かべて。どんな人になりたい？　毎時、ずっとそれを思えば、不思議と理想に近付いていくのだよ<br>出典『How to win friends and influence people』;1章2節",
            "ルーズベルトを大統領にした、政治家にJames Farleyという人がいる。彼は５００,０００人の名前を覚えていた。ルーズベルトの選挙前、Jamesは多くの有権者を訪問した。握手をし、名前を尋ね、そして「この素敵な庭のタチアオイは？」等と聞いて回った。選挙期間になると、尋ねて回った家庭一軒ずつ手紙を送った。彼は「名前を呼ばれる・覚えられていること」はとても有効な誉め言葉であることを知っていたのだ。その結果、多くの投票によりルーズベルトは大統領になった。　<br>名前を覚え、名前を呼ぶことは些細であるが、素晴らしい効果をもたらす。<br>出典『How to win friends and influence people』;1章3節",
            "人が一番うれしいプレゼントは、興味を持って自分の話しを聞いてくれることだ。<br>しかし、うわべ上の興味はすぐにばれる。心から相手の話しに興味をもたなければならない<br>出典『How to win friends and influence people』;1章4節",
            "リンカーン大統領は南北戦争の時、悩みを解決するために友人を家に呼んだという。しかし、リンカーン大統領は友人からのアドバイスを聞かないまま満足してしまい、友人を帰らせた。<br><br>リンカーン大統領はアドバイスを求めていたわけではなかったのだ。ただただ、親身に話を聞いてくれる相手を求めていたのだ。<br>これは、多くの怒った客が求めていることと同じである。<br>出典『How to win friends and influence people』;1章4節",
            "ルーズベルト大統領は、客人が来る前夜に必ずしていたことがある。客人の好きな物事について本などで知識を持つことだ。そして、相手のもっとも大切にしていることについて話すのだ。<br><br>大統領にできて、なぜ我々にできないだろうか。<br>出典『How to win friends and influence people』;1章5節"
        ]

        var list_result = [
            "今日の人運はちょいと悪いかもしんねぇな。でもな、感謝の気持ちだけは忘れんなよ。普段よりも『ありがとう』って言葉をしっかり伝えてみな、いいことあるかもしんねぇぞ。",
            "今日の人運はめちゃくちゃいい日だな。色んな人から協力してもらえるだろうよ。こういう日は、普段からの恩を返すチャンスだぜ。そしたら運気も上がって、もっと良くなっていくぞ。",
            "まぁまぁって感じの日だな。今日はお前がちょっと善いことしてみなよ。誰かにお茶を注ぐとか、ゴミ拾いとか、そんな小さなことでいいんだ。それが運気を上げる秘訣だぜ。",
            "今日はいい日になるだろうよ。会いたい奴に会えるし、苦手な人とも会っても意外とストレス感じない運気だな。",
            "今日の運勢はちょっと悪いかもしんねぇ。疲れが溜まってるかもしれんし、こんな日はゆっくり休んだ方がいいぜ。疲れた顔やイライラも、しっかり休んだら解消するからな。"
        ]

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>あんたの為に運気をあげる話を送る。<br>＝＝＝＝＝＝＝＝＝＝＝<br>　${list_story[this.uranai_fix_ind % list_story.length]}<br>＝＝＝＝＝＝＝＝＝＝＝`
        
        this.modal.innerHTML = result;
    }

    uranai_study(){
        var list_luckyitems = [
            "ノート",
            "ボールペン",
            "高品質な鉛筆",
            "付箋",
            "カラーペン",
            "定規",
            "チェックリスト",
            "学習計画表",
            "参考書",
            "マーカー",
            "ワイヤレスヘッドフォン",
            "静かな場所",
            "目覚まし時計",
            "快適な椅子",
            "フォルダー",
            "細かいメモ帳",
            "充電器",
            "ホワイトボード",
            "クリアファイル",
            "タイマー",
            "アプリ",
            "パソコン",
            "スマートフォン",
            "眼鏡",
            "ブックライト",
            "ホットドリンク",
            "水筒",
            "快適なデスク環境",
            "暖かいスリッパ",
            "明るいデスクランプ",
            "集中を助ける音楽",
            "食事",
            "勉強仲間",
            "モチベーションを高めるポスター",
            "カレンダー",
            "睡眠用具",
            "チョコレート",
            "ストレッチマット",
            "ヨガボール",
            "眼精疲労用アイマスク",
            "お香",
            "スマートウォッチ",
            "健康的な昼食",
            "季節の花",
            "デスク周りの小さな観葉植物",
            "トラベルポーチ",
            "休憩用の音楽プレイリスト",
            "リラックスできる温泉バスソルト",
            "アロマキャンドル",
            "カフェインを含まない飲み物"
        ];
        var list_result = [
            "ふむ、今日の学業運は極めて良好だ。お前の知識吸収力が非常に高く、難解な課題に対しても適切なアプローチができるだろう。だが、油断してはいけない。何事も慎重に、過信せず進め。成功を得るためには、努力を続けることが肝要だ。考えを深め、無駄な一歩を踏み外すな。",
            
            "今日は少しばかり良い運気だろう。新しい知識を得るには好機だが、集中力を欠けば無駄に時間を浪費することになるぞ。どんな状況でも、冷静さと注意力を保ちなさい。前向きに学べば、大きな成長を期待できるかもしれん。しかし、焦りは禁物だ。",
            
            "学業運はごく普通だ。何も特別な出来事はないだろうが、普段通り進めば問題はない。ただし、安定していれば安心してよいというわけではない。着実に物事を進め、基礎を固めることが、将来の成功を支えるのだ。慢心せず、日々積み重ねることが肝心だ。",
            
            "ふむ、今日は少々運が悪いようだ。集中力が途切れ、思うように進まないだろう。だが、これも一つの経験だ。無理に進めることは無駄だし、時には立ち止まることも大切だ。心を落ち着けて休むことが、最終的にはプラスになるだろう。焦ってはいけない。",
            
            "最悪だ。学業運は完全に低迷している。今日のような日は、無理をしても成果は上がらない。だが、覚えておけ、どんな苦境にも意味がある。失敗から学び、次回に備えることが肝要だ。慌てず、今日はゆっくりと振り返ることが賢明だろう。"
          ];

        //------------------
        this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>学業運を上げるラッキーアイテムは<br>${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}ぞ。`
        
        this.modal.innerHTML = result;
    };

    uranai_love(){
        var list_result =  [
            "今日は、何もかも思い通りになる、そんな素敵な日よ。調子が良ければ、好きな人と偶然会ったり、思いがけないサプライズに出会ったり。今日の流れは、まるで私がそっと導いているみたい。<br><br>ラッキーアイテムは太陽の光",
            "今日の運命、もしかしたらあなたは運命の相手と出会うかもしれないわよ。だけど、気をつけて。あなたが誰と出会うかなんて、誰にも分からないわ。言葉遣いにだけは気をつけてね。<br><br>ラッキーアイテムは生姜と蜂蜜",
            "ちょっと前を向いて歩いてみなさい、スマホを見すぎないようにね。ひょっとしたら、初恋の相手とすれ違ってるかもしれないわ。運命があなたをそっと導いているかもしれない。<br><br>ラッキーアイテムは梅干し",
            "今日は何もせず、穏やかに過ごす方が良い日よ。焦って動くと、良くない結果を招くかもしれない。だから今日は、自分に優しく、ゆっくり休んで。<br><br>ラッキーアイテムはハンドクリーム",
            "好きな人に会うチャンスがある日よ。気分を新たにして、素敵な格好で出かけてみなさい。心の準備ができたなら、すぐにでも会えるはず。あなたのラッキーアイテムは、いい匂いのもの。香りで魅力を引き出して。<br><br>ラッキーアイテムはいい匂いのもの"
          ];
        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind % list_result.length]}`
        
        this.modal.innerHTML = result;
    };

    uranai_burokkori(){
        var product_place = [
            "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", 
            "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", 
            "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", 
            "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", 
            "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", 
            "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", 
            "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", 
            "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
            "アメリカ", "中国", "メキシコ", "カナダ", "オーストラリア", 
            "スペイン", "イタリア", "韓国", "ニュージーランド", "チリ"
        ]

        var list_luckyitems = [
            "アレッタ®",
            "おはよう®",
            "ピクセル®",
            "サマードーム®",
            "スターラウンド®",
            "ジェットドーム®",
            "ファイター®",
            "グランドーム®",
            "こんにちは®",
            "クリア®",
            "ウインタードーム®",
            "ベルネ®",
            "ボルト®",
            "はつみらい®",
            "むつみ®",
            "アーリーキャノン®",
            "快緑®"
        ];
        var list_result = [
            "今日は特大ブロッコリーな一日！ブロッコリーを食べて元気いっぱい！！",
            "今日はカリフラワーな一日！美容の運気が上がっているよ！",
            "今日、若葉が生えてきたよ！　ブロッコリーまでもう少しな気分！　早起き早寝で元気な生活！",
            "ブロッコリーは枯れてきたかも。お水をたくさん飲んで　血液サラサラブロッコリー！体調に気を付けて！",
            "虫さんがブロッコリー食べちゃった気分。うーん・・・でも大丈夫。明日はサンサン太陽！グングンブロッコリー！"
        ]
        
        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------

        var result = `${list_result[this.uranai_fix_ind % list_result.length]}<br><br>今日のラッキー生産地は【${product_place[this.uranai_fix_ind % product_place.length]}産】ブロッコリー！。<br><br>ラッキー品種は【${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}】だよ！。`
        
        this.modal.innerHTML = result;
    };

    uranai_usatyann(){
       
        var list_result = [
            "財布の中にギザ10が入っているでしょう。",
            "大学時代の同級生に会うでしょう。",
            "たくさんの人から「ありがとう」と言われるでしょう。",
            "タンスに小指をぶつけるでしょう。",
            "未開拓のジャンルの音楽と出会うでしょう。",
            "ワイシャツのボタンがとれるでしょう。",
            "ちょうど醤油が切れるでしょう。",
            "髭が生えたロン毛の男性から大切なことを言われるでしょう。",
            "肌ツヤが少し良くなるでしょう。",
            "昇進するでしょう。",
            "推しへの愛が冷めるでしょう。",
            "募金をするといいことがあるでしょう。",
            "大雨なので傘を持った方が良いでしょう。",
            "アイスのあたり棒に出会えるでしょう。",
            "寝つきがいいでしょう。",
            "しめじが200円になるでしょう。",
            "新しい家族が増えるでしょう。",
            "携帯電話を買い替えるでしょう。",
            "右手に新たな手相が現れるでしょう。",
            "あなたの体重に変化が起こるでしょう。",
            "赤ちゃんの泣き声を聞くでしょう。",
            "あの会社が合併するでしょう。",
            "珍しい苗字の人と出会うでしょう。",
            "買い物に失敗するでしょう。",
            "自分の新たな一面に気づくでしょう。",
            "転機が訪れるでしょう。",
            "道に迷うでしょう。",
            "過去最高の一日を過ごすでしょう。"
          ];
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1; // 月は0始まり
        var day = today.getDate();
    
        // 今日の日付をフォーマット（例: "2025-1-4" -> "202514"）
        var formattedDate = `${month}/${day}`;

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------

        var result = `<br><br>卯年である2035年の${formattedDate}<br><br>${list_result[this.uranai_fix_ind % list_result.length]}`
        
        this.modal.innerHTML = result;
    };
}                                                                     

class SiteSystem{
    constructor(){
        this.make_fortunetellers_boxs();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // キーを取得
            const value = localStorage.getItem(key); // キーに対応する値を取得
            console.log(`${key}: ${value}`);
        }
    
        //#####################ここはデバックようの記述。　あとで削除すること＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
        window.localStorage.name = "";
        window.localStorage.birth_day = "";
        window.localStorage.birth_month = "";
        window.localStorage.birth_year = "";


        //#$#$#$#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        //listインデクス取り出し
        //ここでは、日付と生年月日を基にした固定のインデックス番号を作成する。
        this.flg = 1;

        
        this.speech = document.getElementById("speech");
        //フキダシのオブジェクトです
        this.controle = document.getElementById("controle");
        //ボタンを載せる台のオブジェクトです
        this.btn1 = document.getElementById("btn1");
        this.btn2 = document.getElementById("btn2");
        //ボタンオブジェクトです
        this.entry = document.getElementById("entry");
        //エントリーオブジェクトです

        this.make_orderboxs();
        
        this.dialogue_index = 0;
       
        //**********************************************
        
        this.show_receptionist();
        this.reception();
    }

    show_receptionist(){
        
        /*ランダムで表示させる画像一覧
        yuurei_miruko.png
        yatugatake_no_hahatati.png
        nityoume_no_titi.png
        ro_tyou.png
        */
      
        const receptionist_img = document.createElement("img");
        
        receptionist_img.src = "sinngann_no_masa.png";
        receptionist_img.alt  = "心眼のマサ　受付"
        
        receptionist_img.id = "pic_receptionist";
        receptionist_img.className  ="receptionist";
        const container = document.getElementById("receptionist");
        
        container.appendChild(receptionist_img);
    }

    reception(){//最初の受付業務
        //constractor(orderbox_logined,orderbox_unlogined,speech,btn1,btn2,entry)
        this.new_ds = new DialogueSystem(this.orderbox_check_register_or_login_logined, this.orderbox_check_register_or_login_unlogined,this.speech,this.btn1,this.btn2,this.entry);
    }

    make_orderboxs(){
            //*********各種ダイアローグ パック****************
        {//【Dialogue Systemの使い方】
        /*
                        

            第一章『会話パックの設定方法』
                1.「定型文」
                    this.dialogues_名前 =[];　が定型文です。
                2.「コマンド式、テンプレートリテラル」
                    テンプレートリテラルは使えません。thisが別class間で提供されないことが原因とみています。
                    そのため、コマンドを文字列に入れることでテンプレートリテラルの動作を実装します。
                    コマンドはDialogue Systemにて分析・読み取られ、文字列を置換し埋め込みます。
                    コマンド一覧が以下の通りです。
                        "I am #command_user_name#"　=　`I am ${this.user_name}`
                        "あなたの誕生日は#command_birth_day# = `あなたの誕生日は${this.birth_day}`

            
            第二章『命令パックの設定方法』
                1.「定型文」
                        [
                            ["命令内容",("第一引数"),("第二引数"),・・・("第n引数") ]
                        ]  
                    これが定型文です。

                2.「会話を一つ進める」
                    会話パックを一つ進める時にはnextを使います。
                        ["next"]
                    のように書きます。nextには命令引数はありません。
                
                3.「確認をさせる(会話インデックスの変化）」
                    確認命令です。はいの場合、会話を一つ進めます。
                    いいえの場合、任意の会話位置、命令位置に移動させます。

                        ["check_<change_d&s_index>",いいえの場合の命令位置,　いいえの場合の会話位置, 表示する文] 
                    が定型文です。
                    機能の解説です。いいえの場合、DialogueSystemでは最初to_dialogue関数で、
                    第二引数を使用し、任意の会話位置に移動します。次に、to_order関数で、
                    第一引数を使用し、任意の命令位置に移動します。最後にdo関数で任意の動作を実行します。

                    あくまでも、＜はい＝進む　いいえ＝任意の場所へ移動＞しかできません。
                    他の動作を希望するときは、新たに関数をつくってください。
                
                4.「会話・命令パックの切り替え」
                    ボタンによってパックを切り替える動作です。はいの場合、引数１つめの会話・命令パックに切り替えます。
                    いいえの場合、引数２つめの会話・命令パックに切り替えます。
                    どちらも、切り替え後にdo()を実行させます。

                        [
                            "change_d&s_pack", はいの場合の[会話パック,命令パック], はいのボタン表記 ,  いいえの場合の[会話パック, 命令パック], いいえの場合のボタン, 分岐時に表示する文 
                        ]
                    すなわち
                        this.orderbox_名前_yes = [はいの場合の会話パック, はいの場合の命令パック];
                        this.orderbox_名前_no = [いええの場合の会話パック,いいえの場合の命令パック];
                        ["change_d&s_pack", this.orderbox_名前_yes ,  this.orderbox_名前_no]
                    が定型文です。

                5.「入力させる」
                    入力させる関数は、入力内容によって関数が用意されています。以下が一覧です。
                        [名前を入力させる　　　：　input_name]
                        [生年月日を入力させる　：　input_birth_day]

                    定型文は　
                        [input_関数名, entryへ表示させる文]
                    です。entryに表示させる文を設定すると、入力画面に薄く説明文が表示されます。
                
                6.「ユーザーidを判定」
                    ユーザーidを判定は、inputと共に使われます。入力された名前と生年月日を基にidを作成し、
                    保存されているユーザーデータを取り出してみます。無事、取り出せるか、データがないかを判定します。
                    
                    定型文は
                        [judge_id,"判定Falseの時に表示する文, 判定False時に移行する命令インデックス番号, 判定False時に移行する会話インデックス番号"]
                    です。
                    判定が成功すれば、nextを実行します。
                    判定が失敗すれば、第一引数の文字を表示し任意の会話・命令インデックス番号に設定。
                    そして、ボタンイベントにdo()を設置します。
                
                6.「任意のページに遷移させる」
                    定型文は
                        ["link", 遷移先の名前]);
                    です。遷移先の名前には ***.html　といったものを入力します

                7.「ユーザーのデータを保存する」
                    定型文は
                        ["save",表示する文]
                    です。
                
                8.「占い師を表示して、好きな人を入力させる」
                    ➀占い師表示
                    ➁check関数的なやつ
                    ➂next関数
                    を含みます

                    定型文は

                    です。
                
                9.「入力された占い師の名前を判定」
                    これがbook_uranaiと共に使われます。
                    予約可能な占い師と入力内容が合致するかを判定します。
                    
                    定型文は
                        [judge_book,"判定Falseの時に表示する文, 判定False時に移行する命令インデックス番号, 判定False時に移行する会話インデックス番号"]
                    です。
                    判定が成功すれば、nextを実行します。
                    判定が失敗すれば、第一引数の文字を表示し任意の会話・命令インデックス番号に設定。
                    そして、ボタンイベントにdo()を設置します。
            */
        }
        
        
        //==============================================================================================
        {//【右の間　占い】box
            this.dialogues_right_uranai = [//【右の間　占い】会話パック
                "<br>では、天の間へご案内します。<br>2階への階段をお進みください"
            ];
            this.orders_right_uranai = [//【右の間　占い】命令パック
                ["load"],
                ["select_uranai_r","<br>占い師を選択してください。"],
                ["judge_book","<br>入力された占い師は名簿にありません。<br>もう一度入力してください",1,1],
                ["call_booked_fortune_teller"]
            ];
            this.right_uranai_box = [this.dialogues_right_uranai,this.orders_right_uranai];
        }
         //==============================================================================================
        {//【左の間　占い】box
            this.dialogues_left_uranai = [//【左の間　占い】会話パック
                "<br>では、地の間へご案内します。<br>足元暗いのでご注意ください"
            ];
            this.orders_left_uranai = [//【右の間　占い】命令パック
                ["load"],
                ["select_uranai_l","<br>占い師を選択してください。"],
                ["judge_book","<br>入力された占い師は名簿にありません。<br>もう一度入力してください",1,1],
                ["call_booked_fortune_teller"]
            ];
            this.left_uranai_box = [this.dialogues_left_uranai,this.orders_left_uranai];
        }   
        //============================================================================================      
        {//【新規登録】box
            this.dialogues_pattern_register = [//【新規登録】会話パック
                                
                                    "<br>ようこそ　占いの館へ。<br>あなたに会える日を待っていましたよ。", //0
                                    "<br>まずは、お名前と生年月日を教えてくれますか？<br>(後から変更不可)",     //1
                                    "<br>ありがとうございます。<br>では、占いの館について説明いたします。",          //3
                                    "<br>占いの館では様々な占い師から、<br>色んな占いを受けることができます。",     //4
                                    "<br>予約の説明です。<br>明日に行う占い師を予約できます。",                    //5
                                    "<br>予約しないと会えない人気占い師も<br>当店に在籍しています。",              //6
                                    "<br>占いの説明です。<br>占うボタンを押すと、占いを受けられます。",            //7
                                    "<br>予約がなくても占えます。<br>予約している場合は、予約した占い師が占います", //8

                                    "<br>では、当店の占いをお楽しみください。"                                   //10
            ]   
            {//【新規登録】命令パック
                this.orders_pattern_register = [
                    ["load"],
                    ["next"],
                    ["input_name","名前を入力してください"],
                    ["input_birth_day"],
                    ["check_<change_d&s_index>",1,1,"<br>#command_user_name#さんは<br>#command_birth_day#生まれですね？"],
                    ["save","<br>お客様を登録いたしました。"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["check_<change_d&s_index>",7,4 ,"<br>説明は以上になります。<br>もう一度聞く場合「いいえ」ボタンを<br>押してください。"],
                    ["change_d&s_pack",this.left_uranai_box,"地の間", this.right_uranai_box,"天の間","<br>#command_user_name#様。<br>改めていらっしゃいませ。<br>どちらのお部屋で占いましょうか"]
                  ];            
            }   
            this.orderbox_pattern_register = [this.dialogues_pattern_register, this.orders_pattern_register,this.orders_list4log_pattern_register]; 
        }
            
        //==============================================================================================
        {//【login】box

            this.dialogues_pattern_login = [//【login】会話パック
                "<br>では、登録したお名前と生年月日を教えてください",
                `<br>#command_user_name#様ですね。<br>確認いたします・・・`
            ];
            {//【login】命令パック

                this.orders_pattern_login = [
                    ["load"],
                    ["input_name","登録した名前を入力してください"],
                    ["input_birth_day"],
                    ["judge_id","<br>申し訳ございません。お客様のデータがありません。<br>もう一度入力してください",0,0],
                    ["change_d&s_pack",this.left_uranai_box,"地の間", this.right_uranai_box,"天の間","<br>#command_user_name#様。<br>改めていらっしゃいませ。<br>どちらのお部屋で占いましょうか"]
                ]
            }
            this.orderbox_pattern_login = [this.dialogues_pattern_login, this.orders_pattern_login];
        }
    
        //=================================================================================================
        {//【受付】box(一番最初に読み込む用。)
            this.orderbox_check_register_or_login_unlogined = [
                [""],//empty dialogue pack
                [["change_d&s_pack",this.orderbox_pattern_login,"はい" ,this.orderbox_pattern_register,"いいえ","<br>ようこそ　占いの館へ<br>お客さまは当店へ来られたことがありますか？"]],
            ];
            this.orderbox_check_register_or_login_logined = [
                [""],//empty dialogue pack
                [["change_d&s_pack",this.left_uranai_box,"地の間", this.right_uranai_box,"天の間","<br>#command_user_name#様。<br>改めていらっしゃいませ。<br>どちらのお部屋で占いましょうか"]]
            ]
        }
    }

    make_fortunetellers_boxs(){
        {//アペプ金運
            this.dialogues_gold = [
                "<br>私はアペプ。<br>あなたの金運を占います。",
                "<br>𓁹𓎆𓎛𓈖𓎡・・・",
                "<br>明日も待っています"
            ];

            this.orders_gold = [
                ["load"],
                ["next"],
                ["uranai","gold"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_gold = [this.dialogues_gold,this.orders_gold];
        }

        {//バシリスク人間関係
            this.dialogues_relationship = [
                "<br>よぅ。周りに沢山の人がみえる。<br>人間関係を占っていく。",
                "<br> ほぅ・・・おもしろい",
                "<br>いつでも来な"
            ];

            this.orders_relationship = [
                ["load"],
                ["next"],
                ["uranai","relationship"],
                ["next"],
                ["link","index.html"]
            ];

            this.orderbox_relationship = [this.dialogues_relationship,this.orders_relationship];

        }

        {//ブロッコリー
            this.dialogues_burokkori = [
                "<br>朝採れたての新鮮ブロッコリーぞい！<br>占うか？？？",
                "<br>ぶろぉーぉぉ",
                "<br>いっぱい食べてね、ブロッコリー！"
            ];

            this.orders_burokkori = [
                ["load"],
                ["next"],
                ["uranai","burokkori"],
                ["next"],
                ["link","index.html"]
            ];

            this.orderbox_burokkori = [this.dialogues_burokkori,this.orders_burokkori];

        }

        {//ラミア―
            this.dialogues_love = [
                "<br>私はラミア―。<br>フフ、あなたも恋占いをしにきたのね",
                "<br>あなたの血を見せてね・・・あら",
                "<br>いつでもきてね。(ペロ)"
            ];

            this.orders_love = [
                ["load"],
                ["next"],
                ["uranai","love"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_love = [this.dialogues_love,this.orders_love];
        }

        {//ヒュドラ
            this.dialogues_work = [
                "<br>私はヒュドラと申します。<br>お客様の仕事運を占います。",
                "<br>（カタカタカタ）・・・出ました",
                "<br>またのご来店お待ちしております。"
            ];

            this.orders_work = [
                ["load"],
                ["next"],
                ["uranai","work"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_work = [this.dialogues_work,this.orders_work];
        }

        {//すこやか
            this.dialogues_health = [
                "<br>初めまして、すこやかです。<br>あなたの健康を占います",
                "<br>口の中を見せて下さい・・・<br>あー　なるほど・・・",
                "<br>お大事になさってください。"
            ];

            this.orders_health = [
                ["load"],
                ["next"],
                ["uranai","health"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_health = [this.dialogues_health,this.orders_health];
        }

        {//ケーリュ
            this.dialogues_study = [
                "<br>わたしゃケーリュケイオン。ケーリュと呼んでくれ。<br>学業の運勢を占うぞ。",
                "<br>ほぉ・・・そうか",
                "<br>迷えばわたしを尋ねるがよい"
            ];

            this.orders_study = [
                ["load"],
                ["next"],
                ["uranai","study"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_study = [this.dialogues_study,this.orders_study];
        }

        {//うさちゃん
            this.dialogues_usatyann = [
                "<br>私　うさちゃん。去年の干支。<br>次の兎年、2035年の今日何が起こるか占うね",
                "<br>(うさちゃんはしっぽをフリフリしている。）",
                "<br>１１年後、楽しみにしててねー"
            ];

            this.orders_usatyann = [
                ["load"],
                ["next"],
                ["uranai","usatyann"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_usatyann = [this.dialogues_usatyann,this.orders_usatyann];
        }
        this.dict_fortune_tellerbox = new Map();
        this.dict_fortune_tellerbox.set("apep.jpg",this.orderbox_gold);
        this.dict_fortune_tellerbox.set("basilisk.jpg",this.orderbox_relationship);
        this.dict_fortune_tellerbox.set("burokkori.jpg",this.orderbox_burokkori);
        this.dict_fortune_tellerbox.set("lamia.jpg",this.orderbox_love);
        this.dict_fortune_tellerbox.set("hydra.jpg",this.orderbox_work);
        this.dict_fortune_tellerbox.set("itzamna.jpg",this.orderbox_health);
        this.dict_fortune_tellerbox.set("keiryu.jpg",this.orderbox_study);
        this.dict_fortune_tellerbox.set("usatyann.jpg",this.orderbox_usatyann);



        //dictionaryに格納

        this.dict_fortune_tellerbox = JSON.stringify(Array.from(this.dict_fortune_tellerbox.entries()));
        //JSON処理
        window.localStorage.dict_fortune_tellerbox = this.dict_fortune_tellerbox;
     
    }
}

//=================================================================================================================================================================================================================================

var site_system =  new SiteSystem();

//以下　占うに関する関数
function fortune(){
    window.location.href = "fortune1.html";
}

function fortune_yes(){

}

function fortune_no(){
    var speech = document.getElementById("speech");
    speech.innerHTML ="本日、予約なしで占える方はこちらです。";
    
}



//以下予約に関する関数
function book(){
    window.location.href = "book1.html";

}

