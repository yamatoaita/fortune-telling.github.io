
class DialogueSystem{
    constructor(dialogue_set, speech, dialogue_index, list_order , btn1, btn2, entry ,check_object=""){
        this.dialogue_set  = dialogue_set; //会話内容　リスト型
        this.speech = speech; //会話を表示させるオブジェクト
        this.dialogue_index = dialogue_index; //dialogue_set（会話内容リスト）のindex番号
        this.order_index = 0;
        this.orders = list_order;//Dictionary型。index番号をkeyとして、行いたい動作(order)を取り出す。
                                       
        this.btn1 = btn1;
        this.btn2 = btn2;
        this.entry = entry;
        this.check_object = check_object;//会話ログのindex番号を表示させるオブジェクト。デバッグ用の道具です。

        this.dialogue_changed_flg = 0; //会話が変わったかを示す。０は変わってない。１は変わったことを示す。
        this.order_changed_flg = 0;



        this.speech.addEventListener("click",() =>{
            this.get_userdata();
        });
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
        
      
        this.order = this.orders[this.order_index];
        //命令書を取り出す
        
        this.order_arg = this.order[1]; //引数を保存
        this.command = this.order[0];//命令を格納
   
        
        //if条件　命令種別を分析
        if(this.command == "next"){
            this.next_dialogue();
        }else if(this.command == "to_dialogue"){
            this.to_dialogue();
        }else if(this.command == "to_order"){
            this.to_order();
        }else if(this.command == "check_<change_d&s_index>"){
            this.check_change_ds_index();
        }else if(this.command == "change_d&s_pack"){
            this.change_ds_pack();
        }else if(this.command == "input_name"){
            this.input_name();
        }else if(this.command == "input_birth_day"){
            this.input_birth_day();
        }else if(this.command == "link"){
            this.link();
        }else if(this.command == "load"){
            this.load_dialogue_4start();
        }else if(this.command == "judge_id"){
            this.judge_id();
        }else if(this.command == "save"){
            this.save_data();
        }
        else{
            alert("it is out of command");
        }// end of if

        this.show_log_4debug();//デバッグ用のconsole.log表示
        
    }

    show_log_4debug(){//console.logに表示させるための機能

        //############パックのテーブル表示#################
        var do_you_wanna_see_table = 1;//ここで調節。１なら表示。０なら非表示

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

    load_dialogue_4start(){
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
        //引数はなし

        this.contents_of_speech = this.dialogue_set[this.dialogue_index];
        //dialogue_indexは会話パックのインデックス番号である。
        //会話パックdialogue_setから、インデックス番号を使って会話を取り出す

        this.translate_command();//#command#の分析・読み取り・置換        
       
        this.speech.innerHTML = this.contents_of_speech;
        
        this.dialogue_changed_flg = 1;//会話を変えたことを記録

    }

    translate_command(){
        //<command>分析・読み取り・置換
        var string_command_list = this.contents_of_speech.matchAll(/#([^#]+)#/g);
        string_command_list.forEach(command =>{//コマンド式テンプレートリテラル法
            
            switch(command[1]){//ここに、処理するコマンドを書く
                case "command_user_name":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_user_name#",this.user_name);
                    
                case "command_birth_day":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_birth_day#",this.birth_day);
            }
        });        
    }

    next_dialogue(){
        //引数はなし
        
       
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
        var second_order_arg = this.order[2];
    
        //任意の会話インデックス値を取得

        this.dialogue_index = second_order_arg;
        //任意の会話になるように、会話インデックス番号を変更
        //必ずto_order()命令インデックス指定関数も一緒に実行してください。
     
        this.load_dialogue();
 
    }

    to_order(){//【to_関数　手順➁】     

        this.order_index = parseInt(this.order_arg);
        this.order_changed_flg = 1;
        //任意の命令になるように、命令インデックス番号を変更
        this.do();
        //更新された命令インデックス番号によって、命令を更新
    } 

    check_change_ds_index(){//checkの分岐によって、会話パックのインデックス番号を変える命令です
  
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
        console.log(this.contents_of_speech);
        this.speech.innerHTML = this.contents_of_speech;//表示する文
        
        this.btn1.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"){
                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない

                this.order_index += 1;
                this.do();
            }
            //【はい】を押した場合のイベント
        },{once:true});     

        this.btn2.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"){
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
    }

    change_ds_pack(){//ボタンの分岐によって、会話・命令パックを切り替える命令です
        //this.order_arg = btn1の時のパック
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
                                                                                                                    
        this.btn1.addEventListener("click", ()=> {
            if(this.order[0]=="change_d&s_pack"){
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
            if(this.order[0]=="change_d&s_pack"){
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
    }

    link(){
       
        window.location.href = this.order_arg;
        this.order_changed_flg = 1;
        //引数にあるhtmlリンクを表示させる
    }

    input_name(){
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "text");
        this.btn1.textContent =  "確定";
        this.btn2.textContent = "ー";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() => {
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
    
        this.entry.setAttribute("type", "date");
        this.entry.placeholder = "";
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() =>{
            this.birth_day = this.entry.value;
            
            this.entry.value = ""
            this.entry.setAttribute("type","text")
            //entryに入力されたデータを初期化。お掃除です。

            //一つ会話を進ませる
            this.order_index += 1;
            this.do();
        },{ once: true })
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }

    save_data(){//ユーザー識別idを製作し、データを保存します
        //this.order_arg = 表示する文

        this.id = `${this.user_name}${this.birth_day}`;
  
        var user_data = [
            this.user_name,
            this.birth_day
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
        this.speech.innerHTML = this.order_arg;
        this.btn1.addEventListener("click", ()=>{
            this.do();
        },{once:true});
        
        this.order_index += 1;

        this.dialogue_changed_flg = 1;
        this.order_changed_flg = 1;
    }

    get_userdata(){
        this.id = `${this.user_name}${this.birth_day}`;        
        var raw_data = window.localStorage.getItem("data");
        this.user_savedata = new Map(JSON.parse(raw_data));
        console.log(`get the data. here you are, ${this.user_savedata.get(this.id)}.`);
        //JSON形式のデータを取り出します
        //その後、JSON形式を解凍します。
        //そして、 data.get(id)でユーザーデータ（LIST型）を取り出せます。
    }

    judge_id(){//id判定。
        this.get_userdata();//入力された名前と生年月日でidを製作。いったん取り出してみる

        this.btn1.textContent = "次へ";
        this.btn2.textContent = "";
        console.log(`id is ${this.id}`);
        
        console.table(this.user_savedata.get(this.id));
        try{
            var id_data = this.user_savedata.get(this.id)[0];
        }
        catch(error){
            var id_data = "nothing";
        };
        if(id_data == "nothing" || id_data === undefined){//idが登録されてなかったら、undefinedになる。
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
            this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に

        }else{//保存データにidが確認され、ユーザーデータを取り出せた時の処理
            this.next_dialogue();
            //next_dialogueでorder_indexとorder_changed_flg変更するから
            //ここでは記述しないこと。
        }
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
        this.fortune_teller = ["yuurei_miruko.png", "sinngann_no_masa.png","tara_sioyaki.png",
                                "yatugatake_no_hahatati.png","burokkori.png",
                                "ro_tyou.png","wilson.png","nityoume_no_titi.png"]
        
        this.today = new Date();
        this.sum_date_index = this.today.getFullYear() + this.today.getMonth() +
                                this.today.getDate();
        this.str_this_time = `${this.today.getFullYear()}${this.today.getMonth()}${this.today.getDate()}${this.today.getHours()}${this.today.getMinutes()}${this.today.getSeconds()}`
        //今回のユーザーのローカルストレージkey番号
        
        this.speech = document.getElementById("speech");
        //フキダシのオブジェクトです
        this.controle = document.getElementById("controle");
        //ボタンを載せる台のオブジェクトです
        this.btn1 = document.getElementById("btn1");
        this.btn2 = document.getElementById("btn2");
        //ボタンオブジェクトです
        this.entry = document.getElementById("entry");
        //エントリーオブジェクトです

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
                            "check_<change_d&s_pack>", はいの場合の[会話パック,命令パック], はいのボタン表記 ,  いいえの場合の[会話パック, 命令パック], いいえの場合のボタン, 分岐時に表示する文 
                        ]
                    すなわち
                        this.orderbox_名前_yes = [はいの場合の会話パック, はいの場合の命令パック];
                        this.orderbox_名前_no = [いええの場合の会話パック,いいえの場合の命令パック];
                        ["check_<change_d&s_pack>", this.orderbox_名前_yes ,  this.orderbox_名前_no]
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
            */
        }
       
    
      

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
                ["link","index.html"]
            ];            
        }    

       
        this.dialogues_pattern_login = [//【login】会話パック
            "<br>では、登録したお名前と生年月日を教えてください",
            `<br>#command_user_name#様ですね。<br>確認いたします・・・`
        ];
        this.dialogues_uranai = [];
        this.orders_uranai = [];
        this.uranai_box = [this.dialogues_uranai,this.orders_uranai];

        this.dialogues_book = [];
        this.orders_book = [];
        this.book_box = [this.dialogues_book,this.orders_book];

        {//【login】命令パック

            this.orders_pattern_login = [
                ["load"],
                ["input_name","登録した名前を入力してください"],
                ["input_birth_day"],
                ["judge_id","<br>申し訳ございません。お客様のデータがありません。<br>もう一度入力してください",0,0],
                ["change_d&s_pack",this.uranai_box,"占う", this.book_box,"予約","<br>#command_user_name#様。<br>改めていらっしゃいませ。今日は何用で？"]
            ]
        }


        this.dialogues_check_register_or_login = [//【受付】会話パック
            ""
        ];
        {//【受付】命令パック
            this.orderbox_register_or_login_yes = [this.dialogues_pattern_login, this.orders_pattern_login];
            this.orderbox_register_or_login_no = [this.dialogues_pattern_register, this.orders_pattern_register,this.orders_list4log_pattern_register];

            this.orders_check_register_or_login = [
                ["change_d&s_pack",this.orderbox_register_or_login_yes,"はい" ,this.orderbox_register_or_login_no,"いいえ","<br>お客さまは当店へ来られたことがありますか？"]
            ]
        }
        //----------------------------------------

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
    
        receptionist_img.src = "yuurei_miruko.png";
        receptionist_img.alt  = "幽霊視子　受付"
        
        receptionist_img.className = "receptionist";
        const container = document.getElementById("receptionist");
        
        container.appendChild(receptionist_img);
    }

    reception(){//最初の受付業務
        

        //dialogue_set, speech, dialogue_index, list_order , btn1, btn2, entry ,check_object
        this.new_ds = new DialogueSystem( this.dialogues_check_register_or_login, this.speech, this.dialogue_index, this.orders_check_register_or_login ,this.btn1,this.btn2, this.entry);
        //this.tester = new DialogueSystem(this.dialogues_pattern_register, this.speech, this.dialogue_index, this.orders_pattern_register ,this.btn1,this.btn2, this.entry )
        this.btn1.addEventListener("click", () =>{
            this.new_ds.do();
            //this.tester.do();                
        }, { once: true });
    
    }
}

//=========================================================================================================================================================

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

