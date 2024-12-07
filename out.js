
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

        this.command_makeid_flg = 0;//新規登録時に、ユーザー識別idを作るflgです
    }

    do(command="",arg=""){ 
        //classの基本メソッド。doを作動させて　classを使います。
        {//do関数の説明
        /*this.orderはリスト型として受け取る。だって、複数の動作を指令することあるからね。
        下に、この複雑なイメージ図を描く。        
        {
            [　

                命令１  [命令内容, 命令に関する引数]
                命令２  [命令内容, 命令に関する引数]

            ]  <====key 【１】で命令LISTboxを開ける
            
            [命令LISTbox](key=2)
            [命令LISTbox](key=3)
            ・
            ・
            ・
            [命令LISTbox](key=n)
        }
        
        実例で表すと・・・
        {
            [　
                ["next", 1]
                

            ]key１で開けた 命令LISTbox　
　
            [命令LISTbox](key=2)
            [命令LISTbox](key=3)
            ・
            ・
            ・
            [命令LISTbox](key=n)
        }DICTIONARY型
        
        つまり流れとして
            ➀keyを使って命令listboxを開ける。
            ➁for繰り返しに命令listboxを入れて、一つずつ個包装の命令を見る
            個包装は0,1の部屋がある。0は命令の種別。1は引数。ここで、命令の種別によってif分類する
            ➃命令の種別に応じた、関数を実行する
        */
        }
        
      
        this.order = this.orders.get(this.order_index);
       
        //Dictionaryのlist_orderから、order_indexをkeyとして命令パックを取り出す
        
        this.order_arg = this.order[1]; //引数を保存
        this.command = this.order[0];
   
        
        //if条件　命令種別を分析
        /*console.log(`【do実行前】;
【命令:order index 「 ${this.order_index}」をカギとして、「${this.command}」を実行しました】
【会話: ${message}】`)
        this.dialogue_changed_flg_4before = 0;
        */
       

        if(this.command == "next"){
            this.next_dialogue();
        }else if(this.command == "to_dialogue"){
            this.to_dialogue();
        }else if(this.command == "to_order"){
            this.to_order();
        }else if(this.command == "check_<change_d&s_index>"){
            this.check_change_ds_index();
        }else if(this.command == "check_<change_d&s_pack>"){
            this.check_change_ds_pack();
        }else if(this.command == "input_name"){
            this.input_name();
        }else if(this.command == "input_birth_year"){
            this.input_birth_year();
        }else if(this.command == "input_birth_month"){
            this.input_birth_month();
        }else if(this.command == "input_birth_day"){
            this.input_birth_day();
        }else if(this.command == "link"){
            this.link();
        }else if(this.command == "load"){
            this.load_dialogue_4start();
        }
        else{
            alert("it is out of command");
        }// end of if

        this.show_log_4debug();//デバッグ用のconsole.log表示
        
    }

    show_log_4debug(){//console.logに表示させるための機能

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
                    var raw_dialogueindex = this.orders.get(this.order_index)[1];//会話インデックス番号
                  
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
            var order_messasge = `「%c${this.command}%c」を実行しました。命令インデックス番号は「%c${this.order_index}%c」に変わりました。次は「%c${this.orders.get(this.order_index)[[0]]}%c」を実行します。%c%c`
            var order_logfont_pattern = [1,0,1,0,1,0,0,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }else if(this.order_changed_flg==2){//flg=2はボタン入力待ち等　実行待ち
            if(this.command == "check_<change_d&s_index>"){//確認する（任意の場所へ移動）は命令が二つ設定されているため別処理。
                var raw_orderindex = this.orders.get(this.order_index)[1];//命令
                var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次ははいの場合「%c${this.orders.get(this.order_index+1)[[0]]}%c」、いいえの場合「%cto_関数を実行後、${this.orders.get(raw_orderindex)[0]}%c」を実行します。`
            }else{//通常処理
                try{//次の命令がある場合の処理
                    var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次は「%c${this.orders.get(this.order_index+1)[[0]]}%c」を実行します。%c%c`
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

        
        //<command>分析・読み取り・置換
        var string_command_list = this.contents_of_speech.matchAll(/#([^#]+)#/g);
        string_command_list.forEach(command =>{//コマンド式テンプレートリテラル法
            
            switch(command[1]){//ここに、処理するコマンドを書く
                case "command_user_name":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_user_name#",this.user_name);
                    
                case "command_birth_year":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_birth_year#",this.birth_year);
                case "command_birth_month":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_birth_month#",this.birth_month);
                case "command_birth_day":
                    this.contents_of_speech = this.contents_of_speech.replace ("#command_birth_day#",this.birth_day);
            }
        });
        this.speech.innerHTML = this.contents_of_speech;
        
        this.dialogue_changed_flg = 1;//会話を変えたことを記録

    }

    next_dialogue(){
        //引数はなし
        
       
        var next_order =this.orders.get(this.order_index)[0];
        
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

    check_btnset(){
        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = "はい"
        this.btn2.textContent = "いいえ"
        //ボタンの表示設定
    }
    check_change_ds_index(){//checkの分岐によって、会話パックのインデックス番号を変える命令です
  
        //arg1:to_order用　　arg2:to_dialogue用
        this.check_btnset();
        //btn等の設定
        
        this.btn1.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"){
                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない
                this.next_dialogue();
                this.btn1.textContent = "次へ"
                this.btn2.textContent = "ー"

                if(this.command_makeid_flg){
                    this.save_data();//id製作フラグが立っていたら、idを製作してユーザーデータを一時保存。
                }
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

    check_change_ds_pack(){//checkの分岐によって、会話・命令パックを切り替える命令です
        this.check_btnset();
        //btn等の設定
        var second_order_arg = this.order[2];
        //いええの時の命令ボックス                                                                                                                
        this.btn1.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_pack>"){
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
            if(this.order[0]=="check_<change_d&s_pack>"){
                this.dialogue_index = 0;
                this.order_index = 0;
                //命令ボックスを移行するため、すべてのインデックス番号を初期化
                this.dialogue_set = second_order_arg[0];
                this.orders  = second_order_arg[1];
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

    input_birth_year(){
       
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() =>{
            this.birth_year = this.entry.value;
            //entryに入力されたデータをkey=birth_yearとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
           
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }

    input_birth_month(){
        
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",()=>{
            this.birth_month = this.entry.value;
            //entryに入力されたデータをkey=birth_monthとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.command_makeid_flg = 1;//ユーザー識別id製作フラグを立てる
            
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }

    input_birth_day(){
        
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定


        this.btn1.addEventListener("click",()=>{
            this.birth_day = this.entry.value;
            //entryに入力されたデータをkey=birth_dayとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。

            this.next_dialogue();
          
            //一つ会話を進ませる
           
        },{ once: true })
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
    }

    save_data(){//ユーザー識別idを製作し、データを保存します
        var id = `${this.user_name}${this.birth_year}${this.birth_month}${this.birth_day}`;
  
        var user_data = [
            this.user_name,
            this.birth_year,
            this.birth_month,
            this.birth_day
        ]
        var user_data_pack = new Map();
        user_data_pack.set(id,user_data);
        var packed_object_map = JSON.stringify(Array.from(user_data_pack.entries()));
        //localStorageでは生のobject mapを保存できません。
        //そのため、JSON形式に変換して保存します。
        window.localStorage.data = packed_object_map;
        //データをストレージに保存
    }

    get_userdata(){
        this.id = `${this.user_name}${this.birth_year}${this.birth_month}${this.birth_day}`;        
        var raw_data = window.localStorage.getItem("data");
        this.user_savedata = new Map(JSON.parse(raw_data));
        //JSON形式のデータを取り出します
        //その後、JSON形式を解凍します。
        //そして、 data.get(id)でユーザーデータ（LIST型）を取り出せます。
    }
}                                                                     

class SiteSystem{
    constructor(){
    
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
                        "I am <command_user_name>"　=　`I am ${this.user_name}`
                        "私の誕生年は<command_birth_year>" = `私の誕生年は${this.birth_year}`
                        "私の誕生月は<command_birth_month>" = `私の誕生月は${this.birth_month}`
                        "私の誕生日は<command_birth_day>" = `私の誕生日は${this.birth_day}`

            
            第二章『命令パックの設定方法』
                1.「定型文」
                        this.orders_名前 = new Map();
                        this.orders_名前.set(0,[命令]);
                    これが定型文です。.set()の第一引数には命令の順番を書きます。初めは0です。

                2.「会話を一つ進める」
                    会話パックを一つ進める時にはnextを使います。
                        this.orders_名前.set(0,["next"]);
                    のように書きます。nextには命令引数はありません。
                
                3.「確認をさせる(会話インデックスの変化）」
                    確認命令です。はいの場合、会話を一つ進めます。
                    いいえの場合、任意の会話位置、命令位置に移動させます。

                        this.orders_名前.set(0,["check_<change_d&s_index>",いいえの場合の命令位置,　いいえの場合の会話位置]) 
                    が定型文です。
                    機能の解説です。いいえの場合、DialogueSystemでは最初to_dialogue関数で、
                    第二引数を使用し、任意の会話位置に移動します。次に、to_order関数で、
                    第一引数を使用し、任意の命令位置に移動します。最後にdo関数で任意の動作を実行します。

                    あくまでも、＜はい＝進む　いいえ＝任意の場所へ移動＞しかできません。
                    他の動作を希望するときは、新たに関数をつくってください。
                
                4.「確認させる（会話・命令パックの切り替え）」
                    確認命令です。はいの場合、引数１つめの会話・命令パックに切り替えます。
                    いいえの場合、引数２つめの会話・命令パックに切り替えます。
                    どちらも、切り替え後にdo()を実行させます。
                        this.orders_名前.set(0,["check_<change_d&s_pack>", はいの場合の[会話パック,命令パック] ,  いいえの場合の[会話パック, 命令パック] ])
                    すなわち
                        this.orderbox_名前_yes = [はいの場合の会話パック, はいの場合の命令パック];
                        this.orderbox_名前_no = [いええの場合の会話パック,いいえの場合の命令パック];
                        this.orders_名前.set(0,["check_<change_d&s_pack>", this.orderbox_名前_yes ,  this.orderbox_名前_no]);
                    が定型文です。

                5.「入力させる（LocalStorageに登録）」
                    入力させる（LocalStorageに登録）関数は、入力内容によって関数が用意されています。以下が一覧です。
                        [名前を入力させる　　　：　input_name]
                        [生まれ年を入力させる　：　input_birth_year]
                        [生まれ月を入力させる　：　input_birth_month]
                        [生まれ日を入力させる　：　input_birth_day]
                    定型文は　
                        this.orders_名前.set(0,[input_関数名, entryへ表示させる文]);
                    です。entryに表示させる文を設定すると、入力画面に薄く説明文が表示されます。
                
                6.「入力させる（入力内容を判定）」
                    入力させる（入力内容を判定）は、入力内容によって関数が用意されています。以下が一覧です。
                        [ユーザー名を判定する : input_judge_username]
                    
                    定型文は
                        this.orders_名前.set(0,[input_judege_関数名]);
                    です。判定が成功すれば、nextを実行します。
                    判定が失敗すれば、会話表示部に「入力内容が間違っているようです。もう一度入力してください」を表示します
                
                6.「任意のページに遷移させる」
                    定型文は
                        this.orders_名前.set(0,["link", 遷移先の名前]);
                    です。遷移先の名前には ***.html　といったものを入力します

            */
        }
       
    
      

        this.dialogues_pattern_register = [//【新規登録】会話パック
                             
                                "<br>ようこそ　占いの館へ。<br>あなたに会える日を待っていましたよ。", //0
                                "<br>まずは、お名前と生年月日を教えてくれますか？<br>(後から変更不可)",     //1
                                "<br>#command_user_name#さんは<br>#command_birth_year#年#command_birth_month#月#command_birth_day#日生まれですね？",//1                               //1は　あとで更新必要なので””にしとく。確認ダイアログです。
                                "<br>ありがとうございます。<br>では、占いの館について説明いたします。",          //3
                                "<br>占いの館では様々な占い師から、<br>色んな占いを受けることができます。",     //4
                                "<br>予約の説明です。<br>明日に行う占い師を予約できます。",                    //5
                                "<br>予約しないと会えない人気占い師も<br>当店に在籍しています。",              //6
                                "<br>占いの説明です。<br>占うボタンを押すと、占いを受けられます。",            //7
                                "<br>予約がなくても占えます。<br>予約している場合は、予約した占い師が占います", //8
                                "<br>説明は以上になります。<br>もう一度聞く場合「いいえ」ボタンを<br>押してください。",//9
                                "<br>では、当店の占いをお楽しみください。"                                   //10
        ]   
        {//【新規登録】命令パック
            var orders = [
                ["load"],
                ["next"],
                ["input_name","名前を入力してください"],
                ["input_birth_year","生まれ年は何年ですか？　　例:2003"],
                ["input_birth_month","生まれ月は？　　　例:3"],
                ["input_birth_day","生まれた日はいつですか？　　　例:31"],
                ["check_<change_d&s_index>",1,1],
                ["next"],
                ["next"],
                ["next"],
                ["next"],
                ["next"],
                ["next"],
                ["check_<change_d&s_index>",7,4],
                ["link","index.html"]
            ];
            let i = 0;
            this.orders_pattern_register = new Map();
            orders.forEach((item) =>{
                this.orders_pattern_register.set(i,item);
                i += 1;
            });
            
            
        }    

       
        this.dialogues_pattern_login = [//【login】会話パック
            "<br>では、お名前を入力してください",
            `#command_user_name#様ですね。<br>こちらへどうぞ`
        ];
        {//【login】命令パック
            this.orders_pattern_login = new Map();
            this.orders_pattern_login.set(0,["load"]);
            this.orders_pattern_login.set(1,["input_judge_user_name","登録した名前を入力してください"]);
        }


        this.dialogues_check_register_or_login = [//【受付】会話パック
            "<br>お客さまは当店へ来られたことがありますか？"
        ];
        {//【受付】命令パック
            this.orders_check_register_or_login = new Map();
            this.orders_check_register_or_login.set(0,["next"]);

            this.orderbox_register_or_login_yes = [this.dialogues_pattern_login, this.orders_pattern_login];
            this.orderbox_register_or_login_no = [this.dialogues_pattern_register, this.orders_pattern_register];
            this.orders_check_register_or_login.set(1,["check_<change_d&s_pack>",this.orderbox_register_or_login_yes, this.orderbox_register_or_login_no])
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

