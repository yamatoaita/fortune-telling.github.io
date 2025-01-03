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

judge_isbooked(){
    if(this.innerfunc_consoleflg){
        console.log(`============================It is %c<JUDGE_ISBOOKED>>`,`color:blue`);
    };

    if(this.booked_fortuneteller){
        this.speech.innerHTML = "<br>では予約された占い師を呼んできます";
        this.btn1.addEventListener("click",() =>{
            this.order_index += 1;
            this.do();
        },{once:true});
    }else{
        this.speech.innerHTML = this.order_arg;
        this.order_arg = "uranai.html";

        this.btn1.addEventListener("click",() =>{
            this.link();
        },{once:true});
                   
    }

    this.order_changed_flg = 2;
    
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
                ["link","uranai.html"]
            ];
            this.book_box = [this.dialogues_book,this.orders_book];
        }

        this.make_fortunetellers_boxs();

        //======================================================================================
        {//【予約時の占い】box    
            this.dialogues_uranai_pattern_booked = [//【予約時の占い】会話パック
                "<br>では、予約を確認します・・・"
            ]
            this.orders_uranai_pattern_booked = [//【予約時の占い】命令パック
                ["load"],
                ["judge_isbooked","<br>予約をされていないようです。<br>もう一度お確かめください。"],
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
