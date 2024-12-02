
class DialogueSystem{
    constructor(dialogue_set, speech, dialogue_index, list_order , btn1, btn2, entry ,check_object=""){
        this.dialogue_set  = dialogue_set; //会話内容　リスト型
        this.speech = speech; //会話を表示させるオブジェクト
        this.dialogue_index = dialogue_index; //dialogue_set（会話内容リスト）のindex番号
        this.order_index = 0;
        this.list_order = list_order;//Dictionary型。index番号をkeyとして、行いたい動作(order)を取り出す。
        this.btn1 = btn1;
        this.btn2 = btn2;
        this.entry = entry;
        this.check_object = check_object;//会話ログのindex番号を表示させるオブジェクト。デバッグ用の道具です。

     
    }

    do(command="",arg=""){ 
        //classの基本メソッド。doを作動させて　classを使います。
        
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
        
        this.order = this.list_order.get(this.order_index);
        //Dictionaryのlist_orderから、order_indexをkeyとして命令パックを取り出す
        
        this.order_arg = this.order[1]; //引数を保存
        this.command = this.order[0];
     
        
        
        //if条件　命令種別を分析
        console.log(`#############Before do, order_index is ${this.order_index},order is ${this.command}#########`);
        if(this.command == "next"){
            this.next_dialogue();
        }else if(this.command == "to_dialogue"){
            this.to_dialogue();
        }else if(this.command == "to_order"){
            this.to_order();
        }else if(this.command == "check"){
            this.check();
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
        }
        else{
            alert("it is out of command");
        }// end of if

        console.log(`order_index is ${this.order_index}, dialogue_index is ${this.dialogue_index}`)
    }

    load_dialogue(){
        //引数はなし

        this.contents_of_speech = this.dialogue_set[this.dialogue_index];
        //dialogue_indexは会話パックのインデックス番号である。
        //会話パックdialogue_setから、インデックス番号を使って会話を取り出す

        try{
            this.speech.innerHTML = this.contents_of_speech();
            //テンプレートリテラル用
        }catch(error){
            this.speech.innerHTML = this.contents_of_speech;
            //テンプレートリテラルでない場合
        }//doの最後に、会話文を更新させる。
       
    }

    next_dialogue(){
        //引数はなし
        
        this.dialogue_index += 1;
        //会話パックのインデックス番号を増加
       
        
        this.order_index += 1;
        //命令を一つ終えたため、命令インデックスを１つ増加
        var next_order =this.list_order.get(this.order_index)[0];
        if(next_order == "check"){           
            this.do();

            //次の命令がcheckの場合は、ボタンセットを表示させるcheck命令を実行させる
        }else{
            this.speech.addEventListener("click", () =>{
                this.do();                
            }, { once: true });
            //speechへのイベント設定は next_order="check"の時はしません。
            //してしまうと、speechのイベントが二重になります。
            //そしてシステムの一大バグ「なぜか会話が一つ飛び」(格闘4時間）を引き起こしてしまいます。
        }
        console.log(`it is next. order_index is ${this.order_index}. dialogue is ${this.dialogue_set[this.dialogue_index]}`)
        
        this.load_dialogue();
        //会話文を更新     
    }

    to_dialogue(){//【to_関数　手順➀】
        var second_order_arg = this.order[2];
        console.log(`second order argument is ${second_order_arg}. this.order is ${this.order}`)
        //任意の会話インデックス値を取得

        this.dialogue_index = second_order_arg;
        //任意の会話になるように、会話インデックス番号を変更
        //必ずto_order()命令インデックス指定関数も一緒に実行してください。
        console.log(`it is back. dialogue index is ${this.dialogue_index}`)
        this.load_dialogue();
 
    }

    to_order(){//【to_関数　手順➁】

        this.order_index = parseInt(this.order_arg);
        //任意の命令になるように、命令インデックス番号を変更
        this.do();
        //更新された命令インデックス番号によって、命令を更新
    }

    check(){
        console.log(`it is check. order_index is ${this.order_index}`)
        //arg1:to_order用　　arg2:to_dialogue用
       
        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = "はい"
        this.btn2.textContent = "いいえ"
        //ボタンの表示設定
        this.btn1.addEventListener("click", ()=> {
            if(this.order[0]=="check"){
                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない
                this.next_dialogue();
                this.btn1.textContent = "ー"
                this.btn2.textContent = "ー"
            }
            //【はい】を押した場合のイベント
        },{once:true});     

        this.btn2.addEventListener("click", ()=> {
            if(this.order[0]=="check"){
                this.btn1.textContent = "ー"
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
        //ボタンのイベント設定
    }

    link(){
        console.log("this is link")
        window.location.href = this.order_arg;
        //引数にあるhtmlリンクを表示させる
    }

    input_name(){
        console.log(`it is input-n. order_index is ${this.order_index}`);
       
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "text");
        this.btn1.textContent =  "確定";
        this.btn2.textContent = "ー";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() => {
            window.localStorage.name = this.entry.value;
            //entryに入力されたデータをkey=nameとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        
    }

    input_birth_year(){
       
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",() =>{
            window.localStorage.birth_year = this.entry.value;
            //entryに入力されたデータをkey=birth_yearとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        
    }

    input_birth_month(){
        
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定

        this.btn1.addEventListener("click",()=>{
            window.localStorage.birth_month = this.entry.value;
            //entryに入力されたデータをkey=birth_monthとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加
            this.do();
            //次の命令に移行させる
        },{ once: true })
        
    }

    input_birth_day(){
        
        this.entry.placeholder = this.order_arg;
        this.entry.setAttribute("type", "number");
        this.btn1.textContent =  "確定";
        //order_argは、promptに表示される説明文
        //entryやボタンの設定


        /* 　え　これ　必要なの？？？？
        this.speech.addEventListener("click", () =>{
            this.do();             
        }, { once: true });
        */

        this.btn1.addEventListener("click",()=>{
            window.localStorage.birth_day = this.entry.value;
            //entryに入力されたデータをkey=birth_dayとしてローカルストレージに保存
            this.entry.value = ""
            //entryに入力されたデータを初期化。お掃除です。
            this.order_index += 1;
            //命令を一つ終えたため、命令インデックスを１つ増加

            this.dialogue_index += 1;
            this.load_dialogue();
            //会話文を一つ進ませる
            this.do();
            //次の命令に移行させる
        },{ once: true })
        
    }

}

class SiteSystem{
    constructor(){
        //#####################ここはデバックようの記述。　あとで削除すること＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃
        //window.localStorage.name = "";
        //window.localStorage.birth_day = "";
        //window.localStorage.birth_month = "";
        //window.localStorage.birth_year = "";


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
        this.dialogue_first_visit = [
                                "<br>まずは、お名前と生年月日を教えてくれますか？<br>(後から変更不可)",     //0
                                () =>`<br>${window.localStorage.name}さんは<br>${window.localStorage.birth_year}年${window.localStorage.birth_month}月${window.localStorage.birth_day}日生まれですね？`,//1                               //1は　あとで更新必要なので””にしとく。確認ダイアログです。
                                "<br>ありがとうございます。<br>では、占いの館について説明いたします。",          //2
                                "<br>占いの館では様々な占い師から、<br>色んな占いを受けることができます。",     //3
                                "<br>予約の説明です。<br>明日に行う占い師を予約できます。",                    //4
                                "<br>予約しないと会えない人気占い師も<br>当店に在籍しています。",              //5
                                "<br>占いの説明です。<br>占うボタンを押すと、占いを受けられます。",            //6
                                "<br>予約がなくても占えます。<br>予約している場合は、予約した占い師が占います", //7
                                "<br>説明は以上になります。<br>もう一度聞く場合「いいえ」ボタンを<br>押してください。",//8
                                "<br>では、当店の占いをお楽しみください。"                                   //9
        ]   
        //dictionary型の作成----------------------
        this.list_order = new Map();
        
        this.list_order.set(0,["next"]);
        this.list_order.set(1,["input_name","名前を入力してください"]);
        this.list_order.set(2,["input_birth_year","生まれ年は何年ですか？　　例:2003"]);
        this.list_order.set(3,["input_birth_month","生まれ月は？　　　例:3"]);
        this.list_order.set(4,["input_birth_day","生まれた日はいつですか？　　　例:31"]);
        this.list_order.set(5,["check",1,0]);
        this.list_order.set(6,["next"]);

        this.list_order.set(7,["next"]);
        this.list_order.set(8,["next"]);
        this.list_order.set(9,["next"]);
        this.list_order.set(10,["next"]);
        this.list_order.set(11,["next"]);
        this.list_order.set(12,["check",6,2]);
        this.list_order.set(13,["link","index.html"])
       
        //----------------------------------------

        this.index_first_visit = -1;
        console.log(this.index_first_visit);
        //**********************************************
        
        this.show_receptionist();
        this.check_first_visit();
    }

    show_receptionist(){
        
    
        const receptionist_img = document.createElement("img");
    
        receptionist_img.src = "yuurei_miruko.png";
        receptionist_img.alt  = "幽霊視子　受付"
        
        receptionist_img.className = "receptionist";
        const container = document.getElementById("receptionist");
        
        container.appendChild(receptionist_img);
    }

    check_first_visit(){
        
        this.name = localStorage.name;
        
        if(this.name == ""){
            //訪問者の情報を登録します。
            this.speech.innerHTML = "<br>ようこそ　占いの館へ。<br>あなたに会える日を待っていましたよ。";
            this.controle.innerHTML = `現在${this.index_first_visit}つめ`;
            
            //dialogue_set, speech, dialogue_index, list_order , btn1, btn2, entry ,check_object
            this.dialog_first_visiter = new DialogueSystem( this.dialogue_first_visit, this.speech, this.index_first_visit, this.list_order ,this.btn1,this.btn2, this.entry,this.controle);
            //this.indexはここでは有効
            this.speech.addEventListener("click", () =>{
                this.dialog_first_visiter.do();                
            }, { once: true });
        }
    }
}

//=========================================================================================================================================================
alert(generateUUID());
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

