
class DialogueSystem{
    constructor(orderbox_logined,orderbox_unlogined,speech,btn1,btn2,entry){
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
        
  

        var value = `; ${document.cookie}`;
        var parts = value.split(`; logined_data=`);
        try{
            var data_list = JSON.parse(decodeURIComponent(parts.pop().split(";").shift()));
        }catch(error){
            var data_list = [];
        }
        /*
        console.log(`%c==============================here is cookie data `,`color:purple`);
        console.table(data_list);
        console.log(`%c＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝That's all `,`color:purple`);
        */

        if(data_list.length> 1){

            this.user_name =data_list[0]         // 0:ユーザー名
            this.birth_day =data_list[1]         // 1:ユーザーの誕生日
            this.booked_fortuneteller = data_list[2] // 2:予約した占い師
            //ここでもうデータを取り出してしまう

  
            this.dialogue_set = this.orderbox_logined[0];
            this.orders = this.orderbox_logined[1];

            this.order_index = 0;
            this.dialogue_index = 0;
            this.do();
            
            
            
        }else{
            this.dialogue_set = this.orderbox_unlogined[0];
            this.orders = this.orderbox_unlogined[1];
            

            this.order_index = 0;
            this.dialogue_index = 0;
            this.do();
        }


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

        var string_command_list = this.contents_of_speech.matchAll(/#([^#]+)#/g);
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
        document.cookie = `logined_data = ${encodeURIComponent(JSON.stringify(user_data))};path=/; expires=${expires.toUTCString()}`;

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

        this.entry.setAttribute("type", "date");
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
            this.birth_day,             // 1:ユーザーの誕生日
            this.booked_fortuneteller   //  2:予約した占い師名
        ]

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
    }

    get_userdata(){// ≪データ記入場≫他に取り出すものが増えたらここに忘れず記入
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<GET_USERDATA>>`,`color:blue`);
        };
        console.log(`$$$$$in get user data$$$$$$${this.user_name}`)
        this.id = `${this.user_name}${this.birth_day}`;        
        var raw_data = window.localStorage.getItem("data");
        this.user_savedata = new Map(JSON.parse(raw_data));
  
        //JSON形式のデータを取り出します
        //その後、JSON形式を解凍します。
        //そして、 data.get(id)でユーザーデータ（LIST型）を取り出せます。
        console.table(this.user_savedata);
        console.log(`=======================${this.id}`)
        try{
            this.user_name = this.user_savedata.get(this.id)[0]         // 0:ユーザー名
            this.birth_day = this.user_savedata.get(this.id)[1]         // 1:ユーザーの誕生日
            this.booked_fortuneteller = this.user_savedata.get(this.id)[2] // 2:予約した占い師
            //ここでもうデータを取り出してしまう
        }catch(error){
            this.user_name = "";
            this.birth_day = "";
            this.booked_fortuneteller = "";
        }
    }
    
    hub_judge(){//各種judge関数において、判定False時の処理
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<HUB_JUDEGE>>`,`color:blue`);
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

        this.get_userdata();//入力された名前と生年月日でidを製作。いったん取り出してみる

        this.btn1.textContent = "次へ";
        this.btn2.textContent = "";
   
        
        
        try{
            var id_data = this.user_savedata.get(this.id)[0];
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
    }

    //######################占いの館専用関数##########################

    book_uranai(){//占い師の予約関数
        //this.order_arg : 表示する文

        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<BOOK_URANAI>>`,`color:blue`);
        };

        this.speech.innerHTML = this.order_arg;//表示文を表示

        this.pic1 = document.getElementById("booking_1");//◎〇〇　写真位置（◎がpic1)
        this.pic2 = document.getElementById("booking_2");//〇◎〇　写真位置（◎がpic2）
        this.pic3 = document.getElementById("booking_3");//〇〇◎　写真位置（◎がpic3)
        
        this.pick_up_fortune_teller();
        //固定ランダムシフト表で占い師を選出

        this.fortune_tellers_path = ["yuurei_miruko.png",  "yatugatake_no_hahatati.png","nityoume_no_titi.png", "ro_tyou.png",
                            "burokkori.png","tara_sioyaki.png","wilson.png",
                            "sinngann_no_masa.png"]
        {
            this.dict_fortune_tellers_keyPath = new Map();
            this.dict_fortune_tellers_keyPath.set("yuurei_miruko.png","幽霊視子");
            this.dict_fortune_tellers_keyPath.set("yatugatake_no_hahatati.png","八ヶ岳の母達");
            this.dict_fortune_tellers_keyPath.set("nityoume_no_titi.png","二丁目の父");
            this.dict_fortune_tellers_keyPath.set("ro_tyou.png","魯徴");
            this.dict_fortune_tellers_keyPath.set("burokkori.png","ブロッコリー");
            this.dict_fortune_tellers_keyPath.set("tara_sioyaki.png","タラ（塩焼き）");
            this.dict_fortune_tellers_keyPath.set("wilson.png","Wilson");
            this.dict_fortune_tellers_keyPath.set( "sinngann_no_masa.png","心眼のマサ");
        }
        {
            this.dict_fortune_tellers_keyName = new Map();
            this.dict_fortune_tellers_keyName.set("幽霊視子","yuurei_miruko.png");
            this.dict_fortune_tellers_keyName.set("八ヶ岳の母達","yatugatake_no_hahatati.png");
            this.dict_fortune_tellers_keyName.set("二丁目の父","nityoume_no_titi.png");
            this.dict_fortune_tellers_keyName.set("魯徴","ro_tyou.png");
            this.dict_fortune_tellers_keyName.set("ブロッコリー","burokkori.png");
            this.dict_fortune_tellers_keyName.set("タラ（塩焼き）","tara_sioyaki.png");
            this.dict_fortune_tellers_keyName.set("Wilson","wilson.png");
            this.dict_fortune_tellers_keyName.set("心眼のマサ","sinngann_no_masa.png");
        }

  
        this.pic1.src = this.fortune_tellers_path[this.pic1_random_number];
        this.pic2.src = this.fortune_tellers_path[this.pic2_random_number];
        this.pic3.src = this.fortune_tellers_path[this.pic3_random_number];      
        //占い師を表示
        this.todays_fortune_tellers = [this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic1_random_number]),
                                        this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic2_random_number]),
                                        this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic3_random_number])
                                    ]

        this.btn1.textContent = "確定";
        this.btn2.textContent = "ー";
        this.entry.placeholder = "占い師の名前を入力";

        this.pic1.addEventListener("click", ()=>{

           this.entry.value = this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic1_random_number]); 
        });
        this.pic2.addEventListener("click", ()=>{
            this.entry.value = this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic2_random_number]);
         });
        this.pic3.addEventListener("click", ()=>{
            this.entry.value = this.dict_fortune_tellers_keyPath.get(this.fortune_tellers_path[this.pic3_random_number]); 
        });
        //画像をクリックするだけでentryに入力するようにする。

        this.btn1.addEventListener("click", ()=>{
            this.order_index += 1;
            this.do();                       
        },{once:true});
        
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }
    pick_up_fortune_teller(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<PICK_UP_FORTUNE_TELLER>>`,`color:blue`);
        };

        var picked_pics_number = [];

        var birth_list = this.birth_day.split("-").map(Number);
        var birth_year = birth_list[0];
        var birth_month = birth_list[1];
        var birth_day = birth_list[2];
        this.today = new Date();
        this.fixed_random_number = this.today.getFullYear() + this.today.getMonth() + this.today.getDate() +
                              birth_year + birth_month + birth_day;
        //固定シフト乱数を生成（日付によってランダムな数が取得されるよ）


        var flg = 1;
        var random_index = 1;
        var picked_number_list = [];

        this.pic1_random_number = (this.fixed_random_number+(random_index*random_index)) % 7
        picked_number_list.push(this.pic1_random_number);
        random_index += 1;
      
        while(flg===1){
            this.pic2_random_number = this.fixed_random_number*random_index  % 7

            if(picked_number_list.includes(this.pic2_random_number)){
                //再ループ
            }else{
                picked_number_list.push(this.pic2_random_number);
                flg = 0;
            }
            random_index += 1;
        }
    

        flg = 1;
        while(flg===1){
            this.pic3_random_number =  (this.fixed_random_number+(random_index*random_index)) % 7
            if(picked_number_list.includes(this.pic3_random_number)){
                //再ループ
            }else{
                picked_number_list.push(this.pic3_random_number);
                flg = 0;
            }
            random_index += 1;
        }

    }

    judge_book(){//占い師が予約可能か判定
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<JUDGE_BOOK>>`,`color:blue`);
        };

        this.btn1.textContent = "次へ";
        this.btn2.textContent = "";


        if(this.todays_fortune_tellers.includes(this.entry.value)){
            this.booked_fortuneteller  = this.dict_fortune_tellers_keyName.get(this.entry.value);
            this.booked_fortuneteller_name = this.entry.value;
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

    choose_fortune_teller(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<CHOOSE_FORTUNE_TELLER>>`,`color:blue`);
        };

        var max_number = 0;
        var min_number = 0;
        var random_number = Math.floor(Math.random() * (max_number - min_number + 1)) + min_number;
        //var list_receptionist = ["yuurei_miruko.png","yatugatake_no_hahatati.png","nityoume_no_titi.png","ro_tyou.png"];
        var list_fortune_tellers = ["yuurei_miruko.png"];
        var fortune_teller = list_fortune_tellers[random_number];

        var fortune_teller_box = window.localStorage.getItem("dict_fortune_tellerbox");
        //JSON加工されたdictionaryを取得
        fortune_teller_box  =  new Map(JSON.parse(fortune_teller_box));
        //JSONを解凍

        fortune_teller_box = fortune_teller_box.get(fortune_teller);

        this.pic_of_fortune_teller = document.getElementById("pic_receptionist");
        this.pic_of_fortune_teller.src = fortune_teller;

        this.dialogue_set = fortune_teller_box[0];
        this.orders = fortune_teller_box[1];
        this.order_index = 0;
        this.dialogue_index = 0;
        this.order_changed_flg = 1;
        this.do();

        
        
    }

    call_booked_fortune_teller(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<CALL_BOOKED_FORTUNE_TELLER>>`,`color:blue`);
        };

        var fortune_teller_box = window.localStorage.getItem("dict_fortune_tellerbox");
        //JSON加工されたdictionaryを取得
        fortune_teller_box  =  new Map(JSON.parse(fortune_teller_box));
        //JSONを解凍

        fortune_teller_box = fortune_teller_box.get(this.booked_fortuneteller);

        this.pic_of_fortune_teller = document.getElementById("pic_receptionist");
        this.pic_of_fortune_teller.src = this.booked_fortuneteller;

        this.dialogue_set = fortune_teller_box[0];
        this.orders = fortune_teller_box[1];
        this.order_index = 0;
        this.dialogue_index = 0;
        this.order_changed_flg = 1;
        this.do();


    }

    uranai(){
        console.log(this.order_arg);
        switch(this.order_arg){
            case "yuurei_miruko":
                this.uranai_yuurei_miruko();
                break;
            case "wilson":
                this.uranai_wilson();
                break;

        }

        this.btn1.addEventListener("click",()=>{
            this.do()
        });
        this.order_changed_flg = 2;
        this.dialogue_changed_flg = 1;
        this.order_index += 1;
    }

    uranai_yuurei_miruko(){
        this.speech.innerHTML = "占いの結果ですぅ";
    }

    uranai_wilson(){
        this.speech.innerHTML = "<br>RESULT OF URANAI, wow";
    }

}                                                                     

class SiteSystem{
    constructor(){
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
        var max_number = 3;
        var min_number = 0;
        var random_number = Math.floor(Math.random() * (max_number - min_number + 1)) + min_number;
        var list_receptionist = ["yuurei_miruko.png","yatugatake_no_hahatati.png","nityoume_no_titi.png","ro_tyou.png"];
       
        const receptionist_img = document.createElement("img");
        
        receptionist_img.src = list_receptionist[random_number];
        receptionist_img.alt  = "幽霊視子　受付"
        
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
        
        //=============================================================================================
        {//【予約画面】box
            this.dialogues_book = [//【予約画面】会話パック
                "<br>占い師のご予約ですね。<br>明日の占い師の名簿を探してきます・・・"
            
            ];
            this.orders_book = [//【予約画面】命令パック
                ["load"],
                ["book_uranai","<br>明日はこちらの方がいます。<br>予約したい占い師を入力してください"],
                ["judge_book","<br>入力された占い師は名簿にありません。<br>もう一度入力してください",1,1],
                ["save", "<br>#command_booked_uranai#を予約いたしました。"],
                ["link","index.html"]
            ];
            this.book_box = [this.dialogues_book,this.orders_book];
        }

        this.make_fortunetellers_boxs();

        //======================================================================================
        {//【予約時の占い】box    
            this.dialogues_uranai_pattern_booked = [//【予約時の占い】会話パック
                "<br>では、予約された占い師を読んできます。"
            ]
            this.orders_uranai_pattern_booked = [//【予約時の占い】命令パック
                ["load"],
                ["call_booked_fortune_teller"]
            ]
            this.uranai_pattern_booked_box = [this.dialogues_uranai_pattern_booked,this.orders_uranai_pattern_booked];
        }

        //============================================================================================
        {//【未予約の占い】box
            this.dialogues_uranai_pattern_nobook = [//【未予約の占い】会話パック
                "<br>では、空いている占い師を呼んできます。"
            ]
            this.orders_uranai_pattern_nobook = [//【未予約の占い】命令パック
                ["load"],
                ["choose_fortune_teller"]
            ]
            this.uranai_pattern_nobooked_box = [this.dialogues_uranai_pattern_nobook,this.orders_uranai_pattern_nobook];
        }
    
        //==============================================================================================
        {//【占い】box
            this.dialogues_uranai = [//【占い】会話パック
                ""
            ];
            this.orders_uranai = [//【占い】命令パック
                ["change_d&s_pack", this.uranai_pattern_booked_box,"はい",this.uranai_pattern_nobooked_box,"いいえ","<br>お客様はご予約されていますか？"]
            ];
            this.uranai_box = [this.dialogues_uranai,this.orders_uranai];
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
                    ["change_d&s_pack",this.uranai_box,"占う", this.book_box,"予約","<br>#command_user_name#様。<br>改めていらっしゃいませ。今日は何用で？"]
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
                    ["change_d&s_pack",this.uranai_box,"占う", this.book_box,"予約","<br>#command_user_name#様。<br>改めていらっしゃいませ。今日は何用で？"]
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
                [["change_d&s_pack",this.uranai_box,"占う", this.book_box,"予約","<br>#command_user_name#様。<br>改めていらっしゃいませ。今日は何用で？"]]
            ]
        }
    }

    make_fortunetellers_boxs(){
        {//幽霊視子
            this.dialogues_yuurei_miruko = [
                "<br>幽霊視子と申します。<br>あなたを占います。",
                "<br>はぁぁぁぁぁぁぁ・・・視えます！！",
                "<br>またのお越しをお待ちしております"
            ];

            this.orders_yuurei_miruko = [
                ["load"],
                ["next"],
                ["uranai","yuurei_miruko"],
                ["next"],
                ["link","index.html"]

            ];

            this.orderbox_yuurei_miruko = [this.dialogues_yuurei_miruko,this.orders_yuurei_miruko];
        }

        {//Wilson
            this.dialogues_wilson = [
                "<br> Hello. I am Wilson.<br> Let me see・・・",
                "<br> year... oh.. wow",
                "<br>See you soon."
            ];

            this.orders_wilson = [
                ["load"],
                ["next"],
                ["uranai","wilson"],
                ["next"],
                ["link","index.html"]
            ];

            this.orderbox_wilson = [this.dialogues_wilson,this.orders_wilson];

        }

        this.dict_fortune_tellerbox = new Map();
        this.dict_fortune_tellerbox.set("yuurei_miruko.png",this.orderbox_yuurei_miruko);
        this.dict_fortune_tellerbox.set("wilson.png",this.orderbox_wilson);
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

