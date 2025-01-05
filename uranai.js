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

        this.input_force_retry  = false;//inputにおいて無記名になると　firebaseの全データが消滅するのでこれを回避するフラグ

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

        this.btn1.textContent = "Next";
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
        
        this.btn1.textContent = "Next";
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
        this.btn1.textContent = "Yes"
        this.btn2.textContent = "No"
        //ボタンの表示設定
        //btn等の設定

        this.contents_of_speech = this.order[3];
        this.translate_command();
        
        this.speech.innerHTML = this.contents_of_speech;//表示する文
        
        var now_functions_index = this.func_CHANGE_DS_INDEX_index + 1;
        this.btn1.addEventListener("click", ()=> {
            if(this.input_force_retry == true){
                this.input_force_retry = false;
                if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                    this.btn1.textContent = "Next"
                    this.btn2.textContent = "ー"

                    alert("Please enter something");
                    //checkは２つのボタンにイベントをつける。
                    //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                    //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない
                    this.to_dialogue();
                    //任意の会話に設定して、ロード
                    this.to_order();
                    //任意の命令に設定して、実行
                }
                //【いいえ】を押した時のイベント
            }else{
                if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                    //checkは２つのボタンにイベントをつける。
                    //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                    //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない

                    this.order_index += 1;
                    this.do();
                }
                //【はい】を押した場合のイベント
            }
        
        },{once:true});      

        this.btn2.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                this.btn1.textContent = "Next"
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
        this.btn1.textContent =  "Enter";
        this.btn2.textContent = "ー";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() => {
            //alert("PRESSED BTN1 IN INPUT NAME");
            this.user_name = this.entry.value;
            if(this.user_name == ""){
                this.input_force_retry = true;
            }
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
        this.btn1.textContent =  "Enter";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() =>{
            this.birth_day = this.entry.value;
            if(this.birth_day == ""){
                this.input_force_retry = true;
            }
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

        this.btn1.textContent =  "Next";
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
            this.btn1.textContent = "Next";
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
                ["lamia.jpg" , "Lamia"],
                ["burokkori.jpg" , "Broccoli"],
                [ "apep.jpg", "Apep"],
                [ "hydra.jpg" , "Hydra"]
            ]

        }else if(arg == "right"){
            
            this.pic1.src = "keiryu.jpg";//学業
            this.pic2.src = "itzamna.jpg";//健康
            this.pic3.src = "basilisk.jpg";//人間関係
            this.pic4.src = "usatyann.jpg";//うさちゃん
        
            this.pic_lists = [
                ["keiryu.jpg" ,"Caduceus"],
                ["itzamna.jpg","Healthy"],
                ["basilisk.jpg" , "Basilisk"],
                [ "usatyann.jpg" ,"Bunny"]
            ]
        }

        this.entry.placeholder = "Enter fortunteller's name";


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

         this.btn1.textContent = "Enter";
         this.btn1.addEventListener("click",()=>{
            this.order_index += 1;
            this.do();           
         },{once:true});
 
         this.btn2.textContent = "Back";
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

        this.btn1.textContent = "Next";
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
        var list_luckyitems = [
            "Tomato",
            "Miso soup",
            "Ginger",
            "Honey",
            "Yuzu",
            "Shredded cabbage",
            "Throat lozenges",
            "Mask",
            "Hand soap",
            "Wild herbs",
            "Gluten-free",
            "Sugar-free foods and drinks",
            "Sunlight",
            "Non-smartphone items",
            "Roasted green tea",
            "Green tea",
            "Caffeine-free items",
            "Pickled plums (Umeboshi)",
            "Apple",
            "Black vinegar",
            "Pleasant fragrance",
            "Water",
            "Non-alcoholic items",
            "Fish",
            "Vegetables",
            "Sweet potato"
        ];
        var list_result = [
            "It might be a day where you are prone to injuries.<br>Pay attention to your surroundings, even in places you usually don’t worry about, to avoid tripping or bumping into things.",
            "You’ll have a pleasant and energetic day.<br>Get some sunlight in the morning and engage in moderate exercise to maintain your health through tomorrow.",
            "It’ll be an average day.<br>Take care of your health today to avoid feeling unwell tomorrow.",
            "You’ll have a good day.<br>To further improve your health, try going to bed early and waking up early. This will help regulate your internal clock and balance your hormones.",
            "It might be a day when your immunity is low.<br>Don’t forget to wash your hands and gargle. Drinking something with honey, plenty of ginger, and vitamin C-rich foods can boost your health for tomorrow."
        ];
        

        var result = `${list_result[this.uranai_fix_ind *2 % list_result.length]}<br><br>Your lucky item to boost your health today is ${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}.`
        
        this.modal.innerHTML = result;
    }

    uranai_gold(){
        var list_luckyitems = [
            "Half-price sticker",
            "Jagged 10-yen coin",
            "New 1,000-yen bill",
            "5-yen coin",
            "Square objects",
            "Eco bag",
            "Eco-friendly materials",
            "Reusable bottle",
            "Non-plastic",
            "Homemade food",
            "Cooking at home",
            "Favorite local shop",
            "Items with freebies",
            "Vegetable seeds",
            "Unused subscriptions",
            "Self-discipline",
            "Australian 1-dollar coin (gold)"
        ];
        
        var list_result = [
            "Your financial luck is likely to be poor today. It’s a good day to save money. Practice moderation and prepare for the days ahead. Even saving 1 dollar a day can add up to 10 dollars in 10 days.",
            "It will be an excellent day. You might make a great purchase today.",
            "Your fortune will be average. Just go about your usual daily routine.",
            "It will be a good day. On a day like this, having the spirit to gift flowers to someone can improve your financial fortune in the future.",
            "Your luck might be on the decline today. Be cautious with big purchases, as they are likely to go wrong. You might end up buying something fake."
        ];
        

        var result = `${list_result[this.uranai_fix_ind * 3 % list_result.length]}<br><br>Today's lucky item for money is ${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}.`
        
        this.modal.innerHTML = result;
    }

    uranai_work(){
        var list_story =[
            "If you are lost, ask a firewood cutter or a grass cutter. <br>『詩経』 (The Book of Songs)",
            "If you are disciplined, the country will not fall into chaos. <br>「詹何」 (Zhan He)",
            "A wise ruler listens widely to the opinions of the people. A foolish ruler trusts only a biased few. <br>『貞観政要』 (The Essentials of Governance)",
            "When arrogance begins, the country faces the crisis of survival. <br>『貞観政要』 (The Essentials of Governance)",
            "The example of the Shang dynasty is not far off. The best models for caution are found nearby. By using history as a mirror, one can understand the rise and fall of things. <br>『貞観政要』 (The Essentials of Governance)",
            "Those who grow trees must first strengthen the roots; those who direct water to far places must first deepen the source. <br>『貞観政要』 (The Essentials of Governance)",
            "The people's complaints are not about the size of things, but about the ruler's morality. <br>『書経』 (The Book of Documents)",
            "Emperor Wen of the Sui dynasty handled all matters alone. However, when he dealt with ten issues, five were unjust. Over many years, such a pattern would lead to the country's destruction. <br>『貞観政要』 (The Essentials of Governance)",
            "When a sick person thinks they are well, they must take extra care. When the country is at peace, it is the time to be most cautious. <br>『貞観政要』 (The Essentials of Governance)",
            "The people are like water; the ruler is like a boat. Water can carry the boat, but it can also overturn it. <br>『荀子』 (Xunzi)",
            "Great things always start from small matters. <br>『貞観政要』 (The Essentials of Governance)",
            "Once, Duke Wen of Jin went hunting and got lost in a distant marsh. He met a fisherman and said, 'I am your ruler. If you guide me, I will reward you.' Once he was rescued, Duke Wen ordered his attendant to write down the fisherman's name. But the fisherman replied, 'Why do you need to know my name? If the ruler governs the country with kindness, easing the people's burdens, then I will also benefit. If the ruler mismanages the country, treats other lords with disrespect, and goes against the people's wishes, even a fisherman like me will not be able to keep any reward.' The fisherman did not accept the reward. <br>『新序』 (The New Preface)",
            "If the ruler is calm and at peace, the people will certainly be at ease. <br>『貞観政要』 (The Essentials of Governance)",
            "A copper mirror can be used to straighten one's clothing. Using the past as a mirror, one can understand the rise and fall of nations. Using people as a mirror, one can see their own virtues and flaws clearly. <br>『貞観政要』 (The Essentials of Governance)",
            "If a ruler wants to know their own mistakes, they must rely on the opinions of loyal ministers. But if a ruler thinks of themselves as wise, the ministers will no longer try to correct them. This is how Emperor Yang of the Sui dynasty perished. <br>『貞観政要』 (The Essentials of Governance)",
            "If a blind person is not guided when in danger and is not helped up when they fall, there is no need for a companion. If a ruler does not help the country avoid destruction, and the ministers merely flatter the ruler, the country will be ruined. The country can only be at peace when ministers advise and admonish the ruler. <br>『貞観政要』 (The Essentials of Governance)",
            "If the ruler gets angry and rebukes the ministers for speaking, no one will dare to advise the ruler anymore. <br>『貞観政要』 (The Essentials of Governance)",
            "The minister's admonition is like a bright mirror; it reflects both the ruler's virtues and vices clearly. <br>『貞観政要』 (The Essentials of Governance)",
            "If the first signs of trouble are not corrected, things will spiral out of control. Eventually, the downfall of the country will come quickly. <br>『貞観政要』 (The Essentials of Governance)",
            "Once, Duke Qi went to the country of Guo and asked an elder, 'Why did Guo fall?' The elder replied, 'The ruler of Guo knew what was good and what was bad.' Duke Qi then asked, 'If the ruler was wise, how did the country fall?' The elder responded, 'The ruler of Guo was not wise. He knew what was good but could not use it, and he knew what was bad but could not remove it. That is why the country fell.' <br>『菅子』 (Guanzi)",
            "The ruler is the head, and the ministers are the hands and feet. Without a body, one cannot be a person. Even if the head is on top, it is the hands and feet that make the body whole. A wise ruler can only govern with the help of capable ministers. <br>『貞観政要』 (The Essentials of Governance); 魏徴 (Wei Zheng)",
            "Do you know Andrew Carnegie, the steel magnate? He produced a quarter of America's steel in the 19th century and became the wealthiest man in the world. <br> It is said that his success was due to his understanding of the value of people's names. He learned this when he was a child. <br><br> One day, young Carnegie secretly kept a wild rabbit but had no food for it. So he thought, 'If you bring me a lot of clover and dandelions, I will name the rabbit after you.' This plan worked perfectly. <br><br> This experience stayed with Carnegie, and later, when he expanded his business, he used this technique. In a negotiation with Pullman, he said, 'Let’s invest together and create a car company. Of course, the company will be named Pullman.' The negotiation, which seemed difficult, was quickly settled. 'Let’s go into the room and discuss it,' Pullman said with a smile, and thus the Pullman Company was born. <br> Source:『How to Win Friends and Influence People』; Chapter 1, Section 3",
            "If the ruler treats the ministers as his hands and feet, the ministers will regard the ruler as their own heart and chest. But if the ruler treats them like dogs and horses, the ministers will think of the ruler as a passerby. If the ruler treats them like dirt or excrement, the ministers will regard the ruler as an enemy. <br>『孟子』 (Mencius)"
        ];
        

        var list_result = [
            "Today's work fortune is a bit unstable. Small mistakes may occur more easily. It is important to be more cautious and thorough than usual. By doing so, mistakes can be avoided.",
            "It looks like today will be a very good day. Work will go smoothly, and everything will progress without any issues. It's also a great opportunity to start a new project or business.",
            "Today's fortune is fairly neutral. It's important to proceed steadily, without pushing yourself too hard. Take breaks when needed and refresh yourself while moving forward.",
            "Today will be a day of smooth progress. Many tasks will be completed as planned, and you'll be able to handle your work without any problems.",
            "Today's fortune might be a bit unfavorable. It's likely that you’re feeling the buildup of daily fatigue. On such a day, it's recommended to take care of yourself and rest, rather than pushing through."
        ]
        

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind * 4 % list_result.length]}<br><br>Let us send you an old saying that will bring you luck.<br>＝＝＝＝＝＝＝＝＝＝＝<br>　${list_story[this.uranai_fix_ind % list_story.length]}<br>＝＝＝＝＝＝＝＝＝＝＝<br><br>I wish you a good day.`
        
        this.modal.innerHTML = result;
    }

    uranai_relationship(){
        var list_story = [
            "People are only interested in themselves. Therefore, they become fond of those who show interest in them. If you want to become close to someone or negotiate, it’s important to first take an interest in that person. Then, they will also take an interest in you. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 1",
            "A smile has the power to change lives. Let me tell you the story of a man. <br> There was a man working as a stockbroker in New York. He had been married for 18 years. However, recently, he hadn't shown a smile to his wife at all. He considered himself the most unsmiling husband in New York. <br> One day, he was troubled by this life and attended a lecture by Carnegie. There, he learned about 'the importance of a smile.' He immediately tried smiling at his wife at home. She was so surprised and asked, 'What happened?' From that day on, he decided to smile at his wife every morning. As a result, their home became happier than ever before. <br> He also tried this at work, and transactions began to go more smoothly than usual. He said, 'A smile brought me money every day.' He became a happier and richer man with the power of a smile. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 2",
            "A smile enriches life. Actions and emotions move together. Happiness doesn't come from the outside; it comes from within by smiling. Simply forcing a smile can make you feel surprisingly happy, enrich your life, and improve relationships. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 2",
            "Visualize the ideal person you want to become. What kind of person do you want to be? If you think about this constantly, you will naturally draw closer to your ideal. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 2",
            "There is a politician named James Farley who helped Roosevelt become president. He remembered the names of 500,000 people. Before Roosevelt's election, James visited many voters, shook hands, asked their names, and asked questions like, 'How are the hollyhocks in this beautiful garden?' During the campaign, he sent a letter to each household he visited. He knew that 'being called by name and being remembered' is a very effective compliment. As a result, Roosevelt became president with many votes. <br> Remembering names and calling them may seem trivial, but it has a wonderful effect. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 3",
            "The best gift people can receive is someone who listens to their story with genuine interest. <br> However, superficial interest is quickly detected. You must genuinely care about what the other person is saying. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 4",
            "President Lincoln, during the Civil War, invited friends to his home to solve his worries. However, Lincoln was satisfied without hearing advice from his friends and sent them home. <br> Lincoln wasn’t looking for advice; he simply wanted someone who would listen to him with genuine concern. <br> This is the same thing many angry customers are looking for. <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 4",
            "President Roosevelt always did something the night before guests arrived. He made sure to learn about their interests from books and then discussed what was most important to them. <br> If the president can do it, why can't we? <br> Source: 'How to Win Friends and Influence People' Chapter 1, Section 5"
        ]
        

        var list_result = [
            "Today's luck with people might be a little rough, but hey, don't forget to show your gratitude. Try saying 'thank you' more than usual today, and maybe some good things will come your way.",
            "Today, your luck with people is looking really good. You'll probably get help from a lot of folks. A day like this is a great chance to return the favors you've received. Doing that will boost your luck even more.",
            "Today’s just okay, nothing extraordinary. Why not do something nice for someone? Pour someone a drink, pick up some trash—small things like that can really help boost your luck.",
            "It looks like it's going to be a good day today. You'll get to meet the people you want to see, and even if you run into someone you don’t get along with, it won’t be as stressful as you think.",
            "Today's luck seems a bit off. You might be feeling tired, so it’s probably better to take it easy today. Those tired looks and irritations will fade once you get the rest you need."
        ]
        

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind  * 5 % list_result.length]}<br><br>"I’m sendin’ you a story to boost your luck, alright?"<br>＝＝＝＝＝＝＝＝＝＝＝<br>　${list_story[this.uranai_fix_ind % list_story.length]}<br>＝＝＝＝＝＝＝＝＝＝＝`
        
        this.modal.innerHTML = result;
    }

    uranai_study(){
        var list_luckyitems = [
            "Notebook",
            "Ballpoint pen",
            "High-quality pencil",
            "Sticky notes",
            "Colored pens",
            "Ruler",
            "Checklist",
            "Study plan sheet",
            "Reference book",
            "Marker",
            "Wireless headphones",
            "Quiet place",
            "Alarm clock",
            "Comfortable chair",
            "Folder",
            "Small memo pad",
            "Charger",
            "Whiteboard",
            "Clear file",
            "Timer",
            "App",
            "Computer",
            "Smartphone",
            "Glasses",
            "Book light",
            "Hot drink",
            "Water bottle",
            "Comfortable desk environment",
            "Warm slippers",
            "Bright desk lamp",
            "Concentration-enhancing music",
            "Meal",
            "Study buddy",
            "Motivational poster",
            "Calendar",
            "Sleep accessories",
            "Chocolate",
            "Stretch mat",
            "Yoga ball",
            "Eye strain relief mask",
            "Incense",
            "Smartwatch",
            "Healthy lunch",
            "Seasonal flowers",
            "Small desk plants",
            "Travel pouch",
            "Breaktime music playlist",
            "Relaxing bath salts",
            "Aromatherapy candle",
            "Caffeine-free drink"
        ]
        
        var list_result =[
            "Hmm, today's academic fortune is exceedingly favorable. Your capacity for knowledge acquisition is exceptionally high, and you will likely approach even the most challenging tasks with appropriate strategies. However, I caution you against complacency. Proceed with careful consideration, without overestimating your abilities. To achieve success, relentless effort is paramount. Delve deeper into your thoughts and avoid unnecessary missteps.",
            
            "Today, you may experience a somewhat positive fortune. It is an opportune moment to acquire new knowledge, but do not be careless, as a lack of concentration will only lead to wasted time. Maintain your composure and focus at all times. If you approach your learning with diligence, substantial growth may follow. However, do not succumb to haste.",
            
            "Your academic fortune is quite average today. There are no extraordinary events to expect, but if you proceed with your usual routine, all should be well. That being said, do not mistake stability for complacency. Steady progress and a solid foundation are essential for future success. Avoid arrogance, and be mindful of the importance of consistent effort each day.",
            
            "Hmm, it seems your fortune today is somewhat unfavorable. You may experience a lack of focus, and progress will be slower than expected. Yet, remember, this too is a valuable experience. Forcing progress when the conditions are not right will be futile, and sometimes, it is wise to pause. Take time to calm your mind and rest; ultimately, this will prove beneficial. Do not rush.",
            
            "The situation is dire. Your academic fortune is thoroughly in decline today. No matter how hard you try, success is unlikely. However, bear in mind that every adversity carries its lessons. It is essential to learn from failure and prepare for the future. Do not panic; instead, take this time to reflect and regroup. It would be wise to avoid unnecessary haste."
        ]
        

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind * 7 % list_result.length]}<br><br>Lucky items for academic luck are <br>${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}.`
        
        this.modal.innerHTML = result;
    };

    uranai_love(){
        var list_result = [
            "Today is a day where everything goes just as you wish. If you're feeling good, you might bump into that special someone, or perhaps find yourself in the midst of a delightful surprise. The flow of today feels as though I am gently guiding it. <br><br> Your lucky item is sunlight.",
            
            "Fate may just have something intriguing in store for you today. You could meet someone fated, but be cautious. You never know who you might cross paths with. Just be careful with your words. <br><br> Your lucky item is ginger and honey.",
            
            "Look ahead for a change, try not to stare at your phone too much. Perhaps you’re passing by your first love without even realizing it. Fate might be subtly guiding you in this very moment. <br><br> Your lucky item is umeboshi (pickled plums).",
            
            "Today is a day better spent in quiet relaxation. If you rush about, it could lead to undesirable results. So, be kind to yourself today and take things slowly. <br><br> Your lucky item is hand cream.",
            
            "There’s a chance you’ll meet someone you fancy today. Refresh yourself and dress up nicely. If you’re prepared in your heart, the meeting will happen soon enough. Your lucky item is something with a delightful fragrance. Let the scent enhance your charm. <br><br> Your lucky item is something with a lovely scent."
        ]
        
        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------
        var result = `${list_result[this.uranai_fix_ind * 8 % list_result.length]}`
        
        this.modal.innerHTML = result;
    };

    uranai_burokkori(){
        var product_place = [
            "America", "China", "Mexico", "Canada", "Australia", 
            "Spain", "Italy", "South Korea", "New Zealand", "Chile"
        ]
        

        var list_luckyitems = [
            "Arcadia",
            "Green Magic",
            "Marathon",
            "Gypsy",
            "Premium",
            "Violin",
            "Shogun",
            "Pacemaker",
            "Coronado",
            "Green Queen",
            "Lucky",
            "Misty",
            "Top Green",
            "Empire",
            "Nutra",
            "Northstar",
            "Bristol",
            "Imperial",
            "Green King",
            "Jetstar"
          ]
          
        var list_result = [
            "Today is a super big broccoli day!", 
            "Eat broccoli and feel full of energy!", 
            "Today is a cauliflower day!", 
            "Your beauty luck is on the rise!", 
            "Today, young leaves have started to sprout!", 
            "Feels like broccoli is just around the corner!", 
            "Early to bed, early to rise for a healthy life!", 
            "Broccoli might be withering.", 
            "Drink lots of water for smooth blood and healthy broccoli!", 
            "Take care of your health!", 
            "It feels like the bugs ate my broccoli.", 
            "Hmm... but it's okay.", 
            "Tomorrow will be a sunny day!", 
            "Grow strong, broccoli!"
        ]
        
        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------

        var result = `${list_result[this.uranai_fix_ind * 9 % list_result.length]}<br><br>Today's lucky production area is【${product_place[this.uranai_fix_ind % product_place.length]}】Yes Broccoli！<br><br>and the lucky variety of broccoli is 【${list_luckyitems[this.uranai_fix_ind % list_luckyitems.length]}】！！`
        
        this.modal.innerHTML = result;
    };

    uranai_usatyann(){
       
        var list_result = [
            "You will find a 10 yen coin in your wallet.",
            "You will meet a classmate from university.",
            "You will be thanked by many people.",
            "You will bump your little finger on the dresser.",
            "You will encounter a genre of music you've never explored before.",
            "The button on your dress shirt will come off.",
            "Your soy sauce will run out at just the right time.",
            "A man with a beard and long hair will tell you something important.",
            "Your skin will become a bit more radiant.",
            "You will get a promotion.",
            "Your love for your favorite person will cool down.",
            "Good things will happen if you make a donation.",
            "It will rain heavily, so you should carry an umbrella.",
            "You will find the winning stick in an ice cream.",
            "You will sleep well tonight.",
            "The price of shimeji mushrooms will be 200 yen.",
            "A new family member will join your household.",
            "You will replace your cell phone.",
            "A new palmistry line will appear on your right hand.",
            "There will be a change in your weight.",
            "You will hear a baby crying.",
            "That company will merge.",
            "You will meet someone with a rare surname.",
            "You will make a shopping mistake.",
            "You will realize a new side of yourself.",
            "A turning point will come.",
            "You will get lost on the road.",
            "You will have the best day of your life."
          ]
          
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1; // 月は0始まり
        var day = today.getDate();
    
        // 今日の日付をフォーマット（例: "2025-1-4" -> "202514"）
        var formattedDate = `${month}/${day}`;

        //------------------
        //this.uranai_fix_ind = Math.floor(Math.random() * 1001);
        //-------------------

        var result = `<br><br>In the bunny year of 2035, ${formattedDate}<br><br>${list_result[this.uranai_fix_ind  * 11 % list_result.length]}`
        
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
                "<br>We will guide you upstairs.<br>pay attension to your foot"
            ];
            this.orders_right_uranai = [//【右の間　占い】命令パック
                ["load"],
                ["select_uranai_r","<br>Please select the fortuneteller"],
                ["judge_book","<br>The fortune teller you entered is not on the roster. Please enter again.",1,1],
                ["call_booked_fortune_teller"]
            ];
            this.right_uranai_box = [this.dialogues_right_uranai,this.orders_right_uranai];
        }
         //==============================================================================================
        {//【左の間　占い】box
            this.dialogues_left_uranai = [//【左の間　占い】会話パック
                "<br>Now, let me show you to the first floor.<br>Please note that it is dark underfoot."
            ];
            this.orders_left_uranai = [//【右の間　占い】命令パック
                ["load"],
                ["select_uranai_l","<br>Please select the fortuneteller"],
                ["judge_book","<br>The fortune teller you entered is not on the roster. Please enter again.",1,1],
                ["call_booked_fortune_teller"]
            ];
            this.left_uranai_box = [this.dialogues_left_uranai,this.orders_left_uranai];
        }   
        //============================================================================================      
        {//【新規登録】box
            this.dialogues_pattern_register = [//【新規登録】会話パック
                                
                "<br>Welcome to the Fortune Teller's House.<br>I've been waiting for the day we could meet.", //0
                "<br>First, could you please tell me your name and date of birth?<br>(Changes are not allowed later)", //1
                "<br>Thank you very much.<br>Now, let me explain about the Fortune Teller's House.", //3
                "In the Fortune Teller's House, <br>you can receive various readings<br>from a wide range of fortune tellers.", //4
                "<br>There are two rooms available.<br>Each has four fortune tellers.", //7
                "Enter the fortune teller's name <br>or tap their image.<br>Then, press the confirm button.", //8
                "You will then be able to receive a reading <br>from the selected fortune teller.<br>Scroll down to read the results of your fortune.", 
                "<br>The results at our Fortune Teller change<br>when the date changes. Enjoy it every day." //10
            ]   
            {//【新規登録】命令パック
                this.orders_pattern_register = [
                    ["load"],
                    ["next"],
                    ["input_name","Please enter your name"],
                    ["input_birth_day"],
                    ["check_<change_d&s_index>",1,1,"<br>Is #command_user_name#'s birth day <br>#command_birth_day#？"],
                    ["save","<br>I have registered your customer."],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["next"],
                    ["check_<change_d&s_index>",7,4 ,"That is all for the explanation.<br>If you want to hear it again,<br> press the “No” button."],
                    ["change_d&s_pack",this.left_uranai_box,"1F", this.right_uranai_box,"2F","<br>Welcome #command_user_name# again.<br> In which floor would you like to have your fortune told?"]
                  ];            
            }   
            this.orderbox_pattern_register = [this.dialogues_pattern_register, this.orders_pattern_register,this.orders_list4log_pattern_register]; 
        }
            
        //==============================================================================================
        {//【login】box

            this.dialogues_pattern_login = [//【login】会話パック
                "<br>Now, please provide your registered name and date of birth.",
                `<br>#command_user_name#, correct?<br>Let me confirm...`
            ];
            {//【login】命令パック

                this.orders_pattern_login = [
                    ["load"],
                    ["input_name","Please enter your registered name"],
                    ["input_birth_day"],
                    ["judge_id","<br>We are sorry. Your data could not be found.<br> Please try again.",0,0],
                    ["change_d&s_pack",this.left_uranai_box,"1F", this.right_uranai_box,"2F","<br>Welcome #command_user_name# again.<br> In which floor would you like to have your fortune told?"]
                ]
            }
            this.orderbox_pattern_login = [this.dialogues_pattern_login, this.orders_pattern_login];
        }
    
        //=================================================================================================
        {//【受付】box(一番最初に読み込む用。)
            this.orderbox_check_register_or_login_unlogined = [
                [""],//empty dialogue pack
                [["change_d&s_pack",this.orderbox_pattern_login,"Yes" ,this.orderbox_pattern_register,"No","<br>Welcome to Fortune-Telling House..<br> Have you ever been to our house?"]],
            ];
            this.orderbox_check_register_or_login_logined = [
                [""],//empty dialogue pack
                [["change_d&s_pack",this.left_uranai_box,"1F", this.right_uranai_box,"2F","<br>Welcome #command_user_name# again.<br> In which floor would you like to have your fortune told?"]]
            ]
        }
    }

    make_fortunetellers_boxs(){
        {//アペプ金運
            this.dialogues_gold = [
               "<br>I am Apep.<br>I will divine your financial fortune.",
                "<br>𓁹𓎆𓎛𓈖𓎡...",
                "<br>I will be waiting for you again tomorrow."
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
                "<br>Yo. I see a lot of people around you.<br>Let's check out your relationships.",
                "<br>Huh... interesting.",
                "<br>Come back anytime."
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
                "<br>Freshly picked broccoli from this morning!<br>Wanna get your fortune told???",
                "<br>BROOOO-COOOLIII!",
                "<br>Eat up lots of broccoli, okay!"

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
                "<br>I am Lamia.<br>Hehe, you've come for a love fortune, haven't you?",
                "<br>Let me see your blood... Oh my.",
                "<br>Come visit me anytime. (slurp)"
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
               "<br>My name is Hydra.<br>I will examine your career fortune.",
                "<br>(Clickety-clack)... Here are the results.",
                "<br>We look forward to your next visit."
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
               "<br>Nice to meet you, I'm Healthy.<br>I will examine your health.",
                "<br>Please show me your mouth...<br>Ah, I see...",
                "<br>Take care of yourself."

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
                "<br>I am Caduceus. Please, call me Cad.<br>I will now read your academic fortune.",
                "<br>Hmm... I see.",
                "<br>If you are uncertain, feel free to seek my guidance."

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
                "<br>I am Bunny. <br>In Japan, we have something called the zodiac.",
                "<br> Two years ago was my year, <br>the Year of the Rabbit.",
                "<br>Let me tell you what will happen on this day in 2035, the next Year of the Rabbit.",
                "<br>(Bunny is wagging its tail.)",
                "<br>Look forward to it in 10 years!"

            ];

            this.orders_usatyann = [
                ["load"],
                ["next"],
                ["next"],
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

