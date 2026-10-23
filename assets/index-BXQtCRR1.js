(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1/30,t={width:18,height:32,riverTop:15,riverBottom:17,bridgeXs:[3.5,14.5],bridgeHalfWidth:1.5},n={regularTime:180,doubleElixirAt:60,overtime:120,tripleElixirAt:60,startElixir:5,maxElixir:10,elixirPerSecond:1/2.8,handSize:4,deckSize:8,cardCycleDelay:2,tiebreakDrainTime:2.5},r={princess:{hp:3052,damage:109,hitSpeed:.8,loadTime:.3,range:7.5,radius:1,footprint:1.5,projectileSpeed:10},king:{hp:4824,damage:109,hitSpeed:1,loadTime:.7,range:7,radius:1.4,footprint:2,projectileSpeed:1e3/60}},i=3.3,a=[{type:`princess`,lane:0,x:3.5,y:25.5},{type:`princess`,lane:1,x:14.5,y:25.5},{type:`king`,lane:-1,x:9,y:29}],o={ownMinY:17,pocketMinY:10},s=.5,c=.2,l=e=>({sight:5.5,radius:.5,mass:4,flying:!1,flyHeight:0,targets:`ground`,deployTime:1,...e}),u=e=>l({targets:`air-ground`,...e,flying:!0}),d={knight:{id:`knight`,name:`騎士`,stats:l({hp:1766,damage:202,hitSpeed:1.2,loadTime:.7,range:1.2,speed:1,mass:6})},archer:{id:`archer`,name:`弓箭手`,stats:l({hp:304,damage:107,hitSpeed:.9,loadTime:.4,range:5,speed:1,mass:3,targets:`air-ground`,projectile:{speed:10,visual:`arrow`,arc:1}})},giant:{id:`giant`,name:`巨人`,stats:l({hp:4091,damage:254,hitSpeed:1.5,loadTime:1,range:1.2,speed:.75,sight:7.5,radius:.75,mass:18,targets:`buildings`,ignorePushback:!0})},goblin:{id:`goblin`,name:`哥布林`,stats:l({hp:202,damage:120,hitSpeed:1.1,loadTime:.7,range:.5,speed:2,mass:2})},spear_goblin:{id:`spear_goblin`,name:`投矛哥布林`,stats:l({hp:133,damage:81,hitSpeed:1.7,loadTime:1.2,range:5.5,speed:2,mass:1,targets:`air-ground`,projectile:{speed:500/60,visual:`spear`,arc:1.2}})},skeleton:{id:`skeleton`,name:`骷髏兵`,stats:l({hp:81,damage:81,hitSpeed:1,loadTime:.5,range:.5,speed:1.5,mass:1})},musketeer:{id:`musketeer`,name:`火槍手`,stats:l({hp:720,damage:218,hitSpeed:1,loadTime:.2,range:6,sight:6,speed:1,mass:5,targets:`air-ground`,projectile:{speed:1e3/60,visual:`bullet`}})},wizard:{id:`wizard`,name:`火焰法師`,stats:l({hp:720,damage:281,hitSpeed:1.4,loadTime:1,range:5.5,speed:1,mass:5,targets:`air-ground`,projectile:{speed:10,visual:`fireball`,splash:1.5,arc:.6}})},iron_swordsman:{id:`iron_swordsman`,name:`鐵甲劍士`,stats:l({hp:1361,damage:720,hitSpeed:1.6,loadTime:1.1,range:.8,speed:1.5,radius:.45,mass:4})},wolf_rider:{id:`wolf_rider`,name:`狼騎兵`,stats:l({hp:1696,damage:318,hitSpeed:1.6,loadTime:1,range:.8,speed:2,sight:9.5,radius:.6,mass:4,targets:`buildings`,jumpsRiver:!0})},axe_dwarf:{id:`axe_dwarf`,name:`旋斧矮人`,stats:l({hp:1908,damage:267,hitSpeed:1.5,loadTime:1.4,range:1.2,speed:1,mass:5,splash:2,splashSelf:!0})},lancer:{id:`lancer`,name:`衝鋒騎士`,stats:l({hp:1920,damage:392,hitSpeed:1.4,loadTime:.9,range:1.6,speed:1,radius:.6,mass:6,ignorePushback:!0,jumpsRiver:!0,charge:{distance:3,speedMul:2,damage:784}})},bomber:{id:`bomber`,name:`炸彈兵`,stats:l({hp:332,damage:222,hitSpeed:1.8,loadTime:1.6,range:4.5,speed:1,mass:4,projectile:{speed:400/60,visual:`bomb`,splash:1.5,arc:2}})},barbarian:{id:`barbarian`,name:`蠻族戰士`,stats:l({hp:670,damage:192,hitSpeed:1.3,loadTime:.9,range:.7,speed:1,mass:4})},golem:{id:`golem`,name:`石巨像`,stats:l({hp:5120,damage:312,hitSpeed:2.5,loadTime:1.5,range:.75,speed:.75,sight:7,radius:.75,mass:20,targets:`buildings`,deployTime:3,ignorePushback:!0,deathDamage:{damage:224,radius:2,pushback:1.8,delay:0,towerMul:1,visual:`quake`},deathSpawn:{unit:`golemite`,count:2}})},golemite:{id:`golemite`,name:`小石像`,stats:l({hp:1040,damage:49,hitSpeed:2.5,loadTime:1.5,range:.25,speed:.75,sight:7,radius:.5,mass:6,targets:`buildings`,deathDamage:{damage:99,radius:2,pushback:.9,delay:0,towerMul:1,visual:`quake`}})},giant_skeleton:{id:`giant_skeleton`,name:`巨骷髏`,stats:l({hp:3424,damage:267,hitSpeed:1.4,loadTime:1.1,range:.8,speed:1,sight:5,radius:1,mass:18,ignorePushback:!0,deathDamage:{damage:534,radius:3,pushback:1.8,delay:3,towerMul:2,visual:`bomb`}})},ice_spirit:{id:`ice_spirit`,name:`冰精靈`,stats:l({hp:230,damage:110,hitSpeed:.3,loadTime:.1,range:2.5,speed:2,radius:.4,mass:1,targets:`air-ground`,kamikaze:!0,projectile:{speed:400/60,visual:`ice`,splash:1.5,freeze:1.2,arc:1.5}})},fire_spirit:{id:`fire_spirit`,name:`火精靈`,stats:l({hp:230,damage:207,hitSpeed:.3,loadTime:.1,range:2,speed:2,radius:.4,mass:1,targets:`air-ground`,kamikaze:!0,projectile:{speed:400/60,visual:`fire`,splash:2.3,arc:1.5}})},witch:{id:`witch`,name:`死靈女巫`,stats:l({hp:838,damage:134,hitSpeed:1.1,loadTime:.4,range:5.5,speed:1,mass:8,targets:`air-ground`,projectile:{speed:10,visual:`magic`,splash:1},spawner:{unit:`skeleton`,count:4,start:1,pause:7,interval:0}})},baby_dragon:{id:`baby_dragon`,name:`幼龍`,stats:u({hp:1152,damage:160,hitSpeed:1.5,loadTime:1.2,range:3.5,speed:1.5,flyHeight:3.5,mass:5,projectile:{speed:500/60,visual:`fire`,splash:1.2}})},bat:{id:`bat`,name:`蝙蝠`,stats:u({hp:81,damage:81,hitSpeed:1.3,loadTime:.7,range:1.2,speed:2,flyHeight:2,mass:1})},gargoyle:{id:`gargoyle`,name:`石像鬼`,stats:u({hp:230,damage:117,hitSpeed:1,loadTime:.5,range:1.6,speed:1.5,flyHeight:1.5,mass:2,projectile:{speed:1e3/60,visual:`spit`}})},bomb_blimp:{id:`bomb_blimp`,name:`炸彈飛艇`,stats:u({hp:1680,damage:640,hitSpeed:2,loadTime:1.8,range:.1,speed:1,sight:7.7,flyHeight:3,mass:6,targets:`buildings`,deathDamage:{damage:240,radius:3,pushback:0,delay:1,towerMul:1,visual:`bomb`}})},cannon:{id:`cannon`,name:`加農砲`,stats:l({hp:824,damage:212,hitSpeed:.9,loadTime:.3,range:5.5,speed:0,radius:.6,mass:100,lifetime:30,half:1,projectile:{speed:1e3/60,visual:`cannonball`}})},inferno:{id:`inferno`,name:`熔岩塔`,stats:l({hp:1749,damage:42,hitSpeed:.4,loadTime:1.2,range:6,sight:6,speed:0,radius:.6,mass:100,targets:`air-ground`,lifetime:30,half:1,ramp:{damages:[42,159,846],stageTime:2}})},elixir_collector:{id:`elixir_collector`,name:`能量收集器`,stats:l({hp:1070,damage:0,hitSpeed:10,loadTime:0,range:0,sight:0,speed:0,radius:1,mass:100,lifetime:65,half:1,elixirGen:{amount:1,interval:9,onDeath:1}})},tunneler:{id:`tunneler`,name:`地道挖掘者`,stats:l({hp:1210,damage:193,hitSpeed:1.2,loadTime:.7,range:1.2,sight:5.5,speed:1.5,mass:6,towerMul:.25,tunnelSpeed:650/60})},mega_gargoyle:{id:`mega_gargoyle`,name:`重甲石像鬼`,stats:u({hp:837,damage:311,hitSpeed:1.5,loadTime:1.1,range:1.6,speed:1,flyHeight:1.5,radius:.6,mass:6,projectile:{speed:1e3/60,visual:`spit`}})},siege_ram:{id:`siege_ram`,name:`攻城衝車`,stats:l({hp:966,damage:286,hitSpeed:.4,loadTime:.05,range:.5,speed:1,radius:.75,mass:6,targets:`buildings`,kamikaze:!0,charge:{distance:3,speedMul:2,damage:571},deathSpawn:{unit:`barbarian`,count:2}})},siege_giant:{id:`siege_giant`,name:`攻城巨人`,stats:l({hp:3072,damage:307,hitSpeed:1.7,loadTime:.8,range:5,speed:.75,sight:7.5,radius:.75,mass:18,targets:`buildings`,ignorePushback:!0,projectile:{speed:1e3/60,visual:`cannonball`,arc:.4}})},berserker:{id:`berserker`,name:`雙斧狂戰士`,stats:l({hp:1341,damage:384,hitSpeed:1.4,loadTime:.9,range:1.2,speed:1.5,sight:6,mass:4})},blowgun_goblin:{id:`blowgun_goblin`,name:`吹管哥布林`,stats:l({hp:260,damage:131,hitSpeed:.7,loadTime:.35,range:6.5,speed:2,sight:7.5,mass:3,targets:`air-ground`,projectile:{speed:800/60,visual:`arrow`}})},spirit_hut:{id:`spirit_hut`,name:`火靈小屋`,stats:l({hp:848,damage:0,hitSpeed:10,loadTime:0,range:0,sight:0,speed:0,radius:1,mass:100,lifetime:28,half:1,spawner:{unit:`fire_spirit`,count:1,start:0,pause:5,interval:0},deathSpawn:{unit:`fire_spirit`,count:1}})},bomb_turret:{id:`bomb_turret`,name:`炸彈砲塔`,stats:l({hp:1356,damage:222,hitSpeed:1.6,loadTime:1.1,range:6,sight:6,speed:0,radius:.6,mass:100,lifetime:30,half:1,projectile:{speed:500/60,visual:`bomb`,splash:1.5,arc:2},deathDamage:{damage:222,radius:3,pushback:0,delay:3,towerMul:1,visual:`bomb`}})},tombstone:{id:`tombstone`,name:`骷髏墓碑`,stats:l({hp:530,damage:0,hitSpeed:10,loadTime:0,range:0,sight:0,speed:0,radius:1,mass:100,lifetime:30,half:1,spawner:{unit:`skeleton`,count:2,start:0,pause:3.5,interval:.5},deathSpawn:{unit:`skeleton`,count:4}})}},f={knight:{id:`knight`,name:`騎士`,glyph:`騎`,color:`#5b7bd5`,cost:3,kind:`troop`,rarity:`common`,role:`耐打的近戰坦克，價格實惠`,unit:`knight`},archers:{id:`archers`,name:`弓箭手`,glyph:`弓`,color:`#3f9c6b`,cost:3,kind:`troop`,rarity:`common`,role:`兩名遠程射手，可打空中`,unit:`archer`,count:2},giant:{id:`giant`,name:`巨人`,glyph:`巨`,color:`#c48a4a`,cost:5,kind:`troop`,rarity:`rare`,role:`超高血量，只攻擊建築`,unit:`giant`},goblins:{id:`goblins`,name:`哥布林`,glyph:`哥`,color:`#5fae3a`,cost:2,kind:`troop`,rarity:`common`,role:`四隻極快的近戰小兵`,unit:`goblin`,count:4},spear_goblins:{id:`spear_goblins`,name:`投矛哥布林`,glyph:`矛`,color:`#6e9a32`,cost:2,kind:`troop`,rarity:`common`,role:`三隻遠程，可打空中`,unit:`spear_goblin`,count:3},skeletons:{id:`skeletons`,name:`骷髏兵`,glyph:`骷`,color:`#8f97a3`,cost:1,kind:`troop`,rarity:`common`,role:`三隻便宜小兵，循環與分心`,unit:`skeleton`,count:3},skeleton_army:{id:`skeleton_army`,name:`骷髏大軍`,glyph:`軍`,color:`#6c7380`,cost:3,kind:`troop`,rarity:`epic`,role:`十五隻骷髏圍毆單體`,unit:`skeleton`,count:15},musketeer:{id:`musketeer`,name:`火槍手`,glyph:`槍`,color:`#8a5bd5`,cost:4,kind:`troop`,rarity:`rare`,role:`長射程單體，可打空中`,unit:`musketeer`},wizard:{id:`wizard`,name:`火焰法師`,glyph:`法`,color:`#d5553f`,cost:5,kind:`troop`,rarity:`rare`,role:`遠程範圍火焰，可打空中`,unit:`wizard`},iron_swordsman:{id:`iron_swordsman`,name:`鐵甲劍士`,glyph:`鐵`,color:`#5d6b8c`,cost:4,kind:`troop`,rarity:`rare`,role:`單體高傷害，剋坦克`,unit:`iron_swordsman`},wolf_rider:{id:`wolf_rider`,name:`狼騎兵`,glyph:`狼`,color:`#b8743a`,cost:4,kind:`troop`,rarity:`rare`,role:`極快、跳過河直衝建築`,unit:`wolf_rider`},axe_dwarf:{id:`axe_dwarf`,name:`旋斧矮人`,glyph:`斧`,color:`#c0653a`,cost:4,kind:`troop`,rarity:`rare`,role:`旋轉巨斧，周圍範圍傷害`,unit:`axe_dwarf`},lancer:{id:`lancer`,name:`衝鋒騎士`,glyph:`衝`,color:`#d0a23a`,cost:5,kind:`troop`,rarity:`epic`,role:`助跑衝鋒，第一擊雙倍傷害`,unit:`lancer`},bomber:{id:`bomber`,name:`炸彈兵`,glyph:`炸`,color:`#7a6a5a`,cost:2,kind:`troop`,rarity:`common`,role:`投擲炸彈範圍傷害，只打地面`,unit:`bomber`},barbarians:{id:`barbarians`,name:`蠻族戰士`,glyph:`蠻`,color:`#b0763c`,cost:5,kind:`troop`,rarity:`common`,role:`五名耐打的近戰戰士`,unit:`barbarian`,count:5},golem:{id:`golem`,name:`石巨像`,glyph:`石`,color:`#7d8a6a`,cost:8,kind:`troop`,rarity:`epic`,role:`超高血量，倒下時爆炸並分裂`,unit:`golem`},giant_skeleton:{id:`giant_skeleton`,name:`巨骷髏`,glyph:`髏`,color:`#9aa0a8`,cost:6,kind:`troop`,rarity:`epic`,role:`倒下時留下巨大炸彈`,unit:`giant_skeleton`},ice_spirit:{id:`ice_spirit`,name:`冰精靈`,glyph:`冰`,color:`#5fb8e0`,cost:1,kind:`troop`,rarity:`common`,role:`撲向敵人，範圍冰凍`,unit:`ice_spirit`},fire_spirit:{id:`fire_spirit`,name:`火精靈`,glyph:`焰`,color:`#e0693a`,cost:1,kind:`troop`,rarity:`common`,role:`撲向敵人，範圍爆炸`,unit:`fire_spirit`},witch:{id:`witch`,name:`死靈女巫`,glyph:`巫`,color:`#7a4b9c`,cost:5,kind:`troop`,rarity:`epic`,role:`範圍魔法彈，持續召喚骷髏`,unit:`witch`},baby_dragon:{id:`baby_dragon`,name:`幼龍`,glyph:`龍`,color:`#c45a8a`,cost:4,kind:`troop`,rarity:`epic`,role:`飛行範圍噴火`,unit:`baby_dragon`},bats:{id:`bats`,name:`蝙蝠群`,glyph:`蝠`,color:`#6a4b8c`,cost:2,kind:`troop`,rarity:`common`,role:`五隻飛行，脆但快`,unit:`bat`,count:5},gargoyles:{id:`gargoyles`,name:`石像鬼`,glyph:`鬼`,color:`#5a6f8a`,cost:3,kind:`troop`,rarity:`common`,role:`三隻飛行，近距離吐擊`,unit:`gargoyle`,count:3},bomb_blimp:{id:`bomb_blimp`,name:`炸彈飛艇`,glyph:`艇`,color:`#b84a4a`,cost:5,kind:`troop`,rarity:`epic`,role:`飛行，只轟炸建築`,unit:`bomb_blimp`},cannon:{id:`cannon`,name:`加農砲`,glyph:`砲`,color:`#6d6f78`,cost:3,kind:`building`,rarity:`common`,role:`防守建築，吸引只打建築的敵人`,unit:`cannon`},inferno:{id:`inferno`,name:`熔岩塔`,glyph:`熔`,color:`#c4502a`,cost:5,kind:`building`,rarity:`rare`,role:`光束越燒越痛，剋坦克`,unit:`inferno`},tombstone:{id:`tombstone`,name:`骷髏墓碑`,glyph:`墓`,color:`#77707a`,cost:3,kind:`building`,rarity:`rare`,role:`持續召喚骷髏，倒下再放四隻`,unit:`tombstone`},elixir_collector:{id:`elixir_collector`,name:`能量收集器`,glyph:`集`,color:`#c85ad0`,cost:6,kind:`building`,rarity:`rare`,role:`每 9 秒產生 1 點能量，倒下時再給 1 點`,unit:`elixir_collector`},tunneler:{id:`tunneler`,name:`地道挖掘者`,glyph:`掘`,color:`#a0743a`,cost:3,kind:`troop`,rarity:`legendary`,role:`從地底鑽到場上任何地方，對塔傷害較低`,unit:`tunneler`},mega_gargoyle:{id:`mega_gargoyle`,name:`重甲石像鬼`,glyph:`甲`,color:`#4a5a7a`,cost:3,kind:`troop`,rarity:`rare`,role:`耐打的飛行遠程，單發傷害高`,unit:`mega_gargoyle`},gargoyle_horde:{id:`gargoyle_horde`,name:`石像鬼群`,glyph:`群`,color:`#5a6f8a`,cost:5,kind:`troop`,rarity:`common`,role:`六隻飛行，用數量壓過去`,unit:`gargoyle`,count:6},siege_ram:{id:`siege_ram`,name:`攻城衝車`,glyph:`槌`,color:`#8a5a32`,cost:4,kind:`troop`,rarity:`rare`,role:`衝向建築撞一下，撞完放出兩名蠻族戰士`,unit:`siege_ram`},siege_giant:{id:`siege_giant`,name:`攻城巨人`,glyph:`砲`,color:`#6a7fa0`,cost:6,kind:`troop`,rarity:`common`,role:`扛大砲的巨人，在 5 格外轟擊建築`,unit:`siege_giant`},berserkers:{id:`berserkers`,name:`雙斧狂戰士`,glyph:`狂`,color:`#c4532a`,cost:6,kind:`troop`,rarity:`common`,role:`兩名跑得快、出手重的近戰`,unit:`berserker`,count:2},blowgun_goblin:{id:`blowgun_goblin`,name:`吹管哥布林`,glyph:`吹`,color:`#4f8a3a`,cost:3,kind:`troop`,rarity:`rare`,role:`射程極遠的快速射手，可打空中`,unit:`blowgun_goblin`},spirit_hut:{id:`spirit_hut`,name:`火靈小屋`,glyph:`屋`,color:`#c8572a`,cost:4,kind:`building`,rarity:`rare`,role:`每 5 秒放出一隻火精靈`,unit:`spirit_hut`},bomb_turret:{id:`bomb_turret`,name:`炸彈砲塔`,glyph:`彈`,color:`#7a6a5a`,cost:4,kind:`building`,rarity:`rare`,role:`範圍轟炸地面部隊，倒下時留下炸彈`,unit:`bomb_turret`},fireball:{id:`fireball`,name:`火球`,glyph:`球`,color:`#e0782f`,cost:4,kind:`spell`,rarity:`rare`,role:`中範圍高傷害並擊退`,spell:{kind:`projectile`,radius:2.5,damage:689,towerPct:.3,speed:10,hitsAir:!0,pushback:1}},arrows:{id:`arrows`,name:`箭雨`,glyph:`箭`,color:`#b8933a`,cost:3,kind:`spell`,rarity:`common`,role:`大範圍三波箭，清小兵`,spell:{kind:`projectile`,radius:4,damage:122,towerPct:.3,speed:1100/60,hitsAir:!0,waves:3,waveInterval:.2}},zap:{id:`zap`,name:`雷擊`,glyph:`雷`,color:`#3a8ed5`,cost:2,kind:`spell`,rarity:`common`,role:`立即傷害並暈眩 0.5 秒`,spell:{kind:`instant`,radius:2.5,damage:192,towerPct:.3,speed:0,hitsAir:!0,stun:.5}},rocket:{id:`rocket`,name:`火箭`,glyph:`彈`,color:`#c0392b`,cost:6,kind:`spell`,rarity:`rare`,role:`小範圍超高傷害，可收塔`,spell:{kind:`projectile`,radius:2,damage:1484,towerPct:.25,speed:350/60,hitsAir:!0,pushback:1.8}},log:{id:`log`,name:`滾木`,glyph:`木`,color:`#9b6b3d`,cost:2,kind:`spell`,rarity:`legendary`,role:`滾過地面擊退，不打空中`,spell:{kind:`roll`,radius:1.95,damage:290,towerPct:.2,speed:200/60,hitsAir:!1,pushback:.7,rollRange:10.1,rollHalfDepth:.6}},poison:{id:`poison`,name:`毒霧`,glyph:`毒`,color:`#7aa83a`,cost:4,kind:`spell`,rarity:`epic`,role:`8 秒持續傷害並緩速`,spell:{kind:`area`,radius:3.5,damage:91,towerPct:.3,speed:0,hitsAir:!0,duration:8,tick:1,slow:.15}},freeze:{id:`freeze`,name:`冰凍`,glyph:`凍`,color:`#7fd3ff`,cost:4,kind:`spell`,rarity:`epic`,role:`範圍內的敵人全部凍住 4 秒`,spell:{kind:`instant`,radius:3,damage:115,towerPct:.3,speed:0,hitsAir:!0,stun:4,freeze:!0}},rage:{id:`rage`,name:`狂暴`,glyph:`怒`,color:`#d0485a`,cost:2,kind:`spell`,rarity:`epic`,role:`範圍內己方移動與攻擊加快 35%`,spell:{kind:`area`,radius:3,damage:0,towerPct:0,speed:0,hitsAir:!0,duration:6,tick:.3,rage:{mul:1.35,linger:2}}},lightning:{id:`lightning`,name:`落雷`,glyph:`霹`,color:`#6a5ad5`,cost:6,kind:`spell`,rarity:`epic`,role:`依序劈中範圍內血量最高的三個目標，並短暫暈眩`,spell:{kind:`lightning`,radius:3.5,damage:1056,towerPct:.3,speed:0,hitsAir:!0,stun:.5,bolts:3,waveInterval:.46}},goblin_barrel:{id:`goblin_barrel`,name:`哥布林飛桶`,glyph:`桶`,color:`#8a6a3a`,cost:3,kind:`spell`,rarity:`epic`,role:`把三隻哥布林丟到任何地方`,spell:{kind:`barrel`,radius:1.5,damage:0,towerPct:1,speed:400/60,hitsAir:!1,spawn:{unit:`goblin`,count:3,deployTime:1.1}}}},p=Object.keys(f),m=[`giant`,`musketeer`,`knight`,`archers`,`fireball`,`zap`,`goblins`,`inferno`],h=[{name:`巨人推進`,cards:[`giant`,`wizard`,`archers`,`goblins`,`arrows`,`zap`,`knight`,`tombstone`]},{name:`狼騎快攻`,cards:[`wolf_rider`,`archers`,`ice_spirit`,`skeletons`,`cannon`,`zap`,`log`,`knight`]},{name:`石像重推`,cards:[`golem`,`baby_dragon`,`gargoyles`,`iron_swordsman`,`zap`,`poison`,`knight`,`elixir_collector`]},{name:`誘餌消耗`,cards:[`goblin_barrel`,`tunneler`,`skeleton_army`,`inferno`,`fireball`,`log`,`knight`,`musketeer`]},{name:`空中轟炸`,cards:[`bomb_blimp`,`giant`,`bats`,`musketeer`,`axe_dwarf`,`arrows`,`freeze`,`ice_spirit`]},{name:`騎士衝鋒`,cards:[`lancer`,`berserkers`,`witch`,`bomber`,`archers`,`zap`,`rage`,`iron_swordsman`]},{name:`地道控場`,cards:[`tunneler`,`musketeer`,`skeletons`,`bomber`,`tombstone`,`log`,`fireball`,`knight`]},{name:`衝車連攻`,cards:[`siege_ram`,`blowgun_goblin`,`mega_gargoyle`,`bomb_turret`,`zap`,`fireball`,`skeletons`,`knight`]},{name:`攻城砲擊`,cards:[`siege_giant`,`spirit_hut`,`gargoyle_horde`,`lightning`,`log`,`bomber`,`ice_spirit`,`archers`]}];function g(e){return e.length===8&&new Set(e).size===8&&e.every(e=>e in f)}function _(e){return e.unit?d[e.unit]:void 0}function v(e){return e.kind===`spell`?e.spell.hitsAir:_(e).stats.targets===`air-ground`}function y(e){"@babel/helpers - typeof";return y=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},y(e)}function b(e,t){if(y(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(y(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function x(e){var t=b(e,`string`);return y(t)==`symbol`?t:t+``}function S(e,t,n){return(t=x(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var C=class e{constructor(e){S(this,`s`,void 0),this.s=e>>>0}next(){this.s=this.s+1831565813>>>0;let e=this.s;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e){return Math.floor(this.next()*e)}pick(e){return e[this.int(e.length)]}shuffle(e){for(let t=e.length-1;t>0;t--){let n=this.int(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}fork(){return new e(Math.floor(this.next()*4294967296))}},w=t.width,T=t.height;function E(e,t){return e===0?t:T-t}function D(e,t,n,r){return Math.hypot(e-n,t-r)}function O(e,t,n){if(n.half>0){let r=Math.max(0,Math.abs(e-n.x)-n.half),i=Math.max(0,Math.abs(t-n.y)-n.half);return Math.hypot(r,i)}return Math.max(0,D(e,t,n.x,n.y)-n.stats.radius)}function k(e){let t=r[e];return{hp:t.hp,damage:t.damage,hitSpeed:t.hitSpeed,loadTime:t.loadTime,range:t.range,sight:t.range,speed:0,radius:t.radius,mass:1e3,flying:!1,flyHeight:0,targets:`air-ground`,deployTime:0,projectile:{speed:t.projectileSpeed,visual:e===`king`?`king-ball`:`tower-arrow`,arc:e===`king`?.6:.8},half:t.footprint}}function A(e){switch(e){case 1:return[[0,0]];case 2:return[[-.6,0],[.6,0]];case 3:return[[0,-.55],[-.6,.4],[.6,.4]];case 4:return[[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]];case 5:return[[0,0],[-.8,-.6],[.8,-.6],[-.8,.6],[.8,.6]];default:{let t=[[0,0]],n=Math.min(6,e-1);for(let e=0;e<n;e++){let r=e/n*Math.PI*2;t.push([Math.cos(r)*.9,Math.sin(r)*.9])}let r=e-1-n;for(let e=0;e<r;e++){let n=e/r*Math.PI*2+.3;t.push([Math.cos(n)*1.75,Math.sin(n)*1.75])}return t}}}var j=class{constructor(e){S(this,`rng`,void 0),S(this,`seed`,void 0),S(this,`time`,0),S(this,`tick`,0),S(this,`phase`,`regular`),S(this,`timeLeft`,n.regularTime),S(this,`players`,void 0),S(this,`entities`,[]),S(this,`projectiles`,[]),S(this,`spells`,[]),S(this,`areas`,[]),S(this,`rollers`,[]),S(this,`bombs`,[]),S(this,`events`,[]),S(this,`result`,null),S(this,`nextId`,1),S(this,`lastMult`,1),S(this,`drainRate`,0),this.seed=e.seed,this.rng=new C(e.seed),this.players=[this.makePlayer(e.decks[0]),this.makePlayer(e.decks[1])];for(let e of[0,1])for(let t of a){let n=e===0?t.x:w-t.x,r=this.spawnEntity(e,`tower`,t.type,t.type,k(t.type),n,E(e,t.y));r.lane=t.type===`princess`?n<w/2?0:1:-1,r.active=t.type===`princess`}}makePlayer(e){let t=this.rng.shuffle([...e]);return{elixir:n.startElixir,hand:t.slice(0,n.handSize),queue:t.slice(n.handSize),nextReadyAt:0,crowns:0,cardsPlayed:0,elixirSpent:0,elixirLeaked:0,elixirGained:0}}spawnEntity(e,t,n,r,i,a,o){let s={id:this.nextId++,team:e,kind:t,unit:n,cardId:r,lane:-1,x:a,y:o,px:a,py:o,hp:i.hp,maxHp:i.hp,stats:i,half:i.half??0,alive:!0,targetId:-1,locked:!1,attacking:!1,cooldown:0,deployTimer:0,stunTimer:0,frozen:!1,slowTimer:0,slowMul:1,lifetime:1/0,active:!0,activateTimer:0,avoidSide:0,chargeDist:0,charging:!1,rampTime:0,spawnTimer:0,spawnLeft:0,spawnGap:0,kbx:0,kby:0,kbTime:0,moving:!1,facing:e===0?-Math.PI/2:Math.PI/2,jumping:!1,lastAttack:-99,rageTimer:0,rageMul:1,tunneling:!1,tunnelX:a,tunnelY:o,genTimer:i.elixirGen?.interval??0};return this.entities.push(s),s}get(e){for(let t of this.entities)if(t.id===e)return t}towers(e){return this.entities.filter(t=>t.kind===`tower`&&t.team===e)}king(e){return this.entities.find(t=>t.kind===`tower`&&t.team===e&&t.unit===`king`)}elixirMultiplier(){return this.phase===`overtime`?this.timeLeft<=n.tripleElixirAt?3:2:this.phase===`regular`&&this.timeLeft<=n.doubleElixirAt?2:1}cycleDelay(){return n.cardCycleDelay/this.elixirMultiplier()}get playing(){return this.phase===`regular`||this.phase===`overtime`}snap(e,t,n){let r=f[e],i=r?.kind===`building`?d[r.unit].stats.half??1:0;return i>0&&Number.isInteger(i)?[Math.max(i,Math.min(w-i,Math.round(t))),Math.max(i,Math.min(T-i,Math.round(n)))]:[Math.max(.5,Math.min(w-.5,Math.floor(t)+.5)),Math.max(.5,Math.min(T-.5,Math.floor(n)+.5))]}inDeployZone(e,n,r){if(n<=0||n>=w||r<=0||r>=T)return!1;let i=E(e,r);if(i>=o.ownMinY)return!0;if(i<o.pocketMinY||i>=t.riverTop)return!1;let a=n<w/2?0:1,s=+(e===0);return this.towers(s).some(e=>e.unit===`princess`&&!e.alive&&e.lane===a)}occupied(e,t,n){for(let r of this.entities)if(!(!r.alive||r.half<=0)&&Math.abs(e-r.x)<r.half+n&&Math.abs(t-r.y)<r.half+n)return!0;return!1}canDeployAt(e,n,r,i){let a=f[n];if(!a||r<0||r>w||i<0||i>T)return!1;if(a.kind===`spell`)return!0;if(a.kind===`building`){let t=d[a.unit].stats.half??1;for(let n=-t+.5;n<t;n+=1)for(let a=-t+.5;a<t;a+=1)if(!this.inDeployZone(e,r+n,i+a))return!1;return!this.occupied(r,i,t)}return d[a.unit].stats.tunnelSpeed?r<=0||r>=w||i<=0||i>=T||i>t.riverTop&&i<t.riverBottom?!1:!this.occupied(r,i,.01):this.inDeployZone(e,r,i)&&!this.occupied(r,i,.01)}deploy(e,t,n,r){if(!this.playing)return{ok:!1,reason:`ended`};let i=this.players[e],a=i.hand[t],o=a?f[a]:void 0;if(!o||!a)return{ok:!1,reason:`card`};if(i.elixir<o.cost)return{ok:!1,reason:`elixir`};let[s,c]=this.snap(a,n,r);return this.canDeployAt(e,a,s,c)?(i.elixir-=o.cost,i.elixirSpent+=o.cost,i.cardsPlayed++,i.hand[t]=null,i.queue.push(a),this.fillHand(i),this.events.push({type:`deploy`,team:e,cardId:a,x:s,y:c,cost:o.cost}),o.kind===`spell`?this.castSpell(e,o,s,c):this.spawnCard(e,o,s,c),{ok:!0,x:s,y:c}):{ok:!1,reason:`zone`}}fillHand(e){for(let t=0;t<e.hand.length;t++)if(e.hand[t]===null){if(this.time+1e-9<e.nextReadyAt||e.queue.length===0)return;e.hand[t]=e.queue.shift(),e.nextReadyAt=this.time+this.cycleDelay()}}spawnCard(e,t,n,r){let i=d[t.unit];if(t.kind===`building`){let a=this.spawnEntity(e,`building`,i.id,t.id,i.stats,n,r);a.deployTimer=i.stats.deployTime,a.lifetime=i.stats.lifetime??1/0,this.initSpawner(a),this.events.push({type:`spawn`,id:a.id,team:e,unit:i.id,x:n,y:r,source:`card`});return}if(i.stats.tunnelSpeed){let a=this.king(e),o=a.y+(e===0?-1:1)*(a.half+.4),s=this.spawnEntity(e,`troop`,i.id,t.id,i.stats,a.x,o);s.tunneling=!0,s.tunnelX=n,s.tunnelY=r,s.facing=Math.atan2(r-o,n-a.x),this.events.push({type:`spawn`,id:s.id,team:e,unit:i.id,x:s.x,y:s.y,source:`tunnel`});return}let a=t.count??1,o=e===0?1:-1;for(let[s,c]of A(a))this.spawnUnit(e,i.id,t.id,n+s,r+c*o,i.stats.deployTime,`card`)}spawnUnit(e,t,n,r,i,a,o){let s=d[t],c=this.spawnEntity(e,`troop`,t,n,s.stats,r,i);return c.deployTimer=a,this.initSpawner(c),this.constrain(c,!0),c.px=c.x,c.py=c.y,this.events.push({type:`spawn`,id:c.id,team:e,unit:t,x:c.x,y:c.y,source:o}),c}initSpawner(e){let t=e.stats.spawner;t&&(e.spawnTimer=t.start)}castSpell(e,t,n,r){let i=t.spell,a=this.king(e);switch(i.kind){case`instant`:this.events.push({type:`spellCast`,team:e,cardId:t.id,x:n,y:r,fromX:a.x,fromY:a.y,delay:0}),this.applySpell(e,t.id,i,n,r,1);return;case`area`:this.events.push({type:`spellCast`,team:e,cardId:t.id,x:n,y:r,fromX:a.x,fromY:a.y,delay:0}),this.areas.push({id:this.nextId++,team:e,cardId:t.id,x:n,y:r,radius:i.radius,timeLeft:i.duration,duration:i.duration,tickTimer:0,ticksLeft:i.rage?0:Math.round(i.duration/(i.tick??1))});return;case`lightning`:this.events.push({type:`spellCast`,team:e,cardId:t.id,x:n,y:r,fromX:n,fromY:r,delay:0}),this.spells.push({id:this.nextId++,team:e,cardId:t.id,x:n,y:r,fromX:n,fromY:r,delay:.2,totalDelay:.2,wavesLeft:i.bolts??3,waveTimer:0,struck:[]});return;case`roll`:{let i=e===0?-1:1;this.events.push({type:`spellCast`,team:e,cardId:t.id,x:n,y:r,fromX:n,fromY:r,delay:0}),this.rollers.push({id:this.nextId++,team:e,cardId:t.id,x:n,y:r,startY:r,dir:i,traveled:0,hit:new Set});return}default:{let o=D(a.x,a.y,n,r)/i.speed;this.events.push({type:`spellCast`,team:e,cardId:t.id,x:n,y:r,fromX:a.x,fromY:a.y,delay:o}),this.spells.push({id:this.nextId++,team:e,cardId:t.id,x:n,y:r,fromX:a.x,fromY:a.y,delay:o,totalDelay:o,wavesLeft:i.waves??1,waveTimer:0})}}}drainEvents(){let e=this.events;return this.events=[],e}step(){if(this.phase===`ended`)return;this.tick++,this.time+=e;for(let e of this.entities)e.px=e.x,e.py=e.y;if(this.phase===`tiebreak`){this.updateTiebreak();return}let t=this.elixirMultiplier();t!==this.lastMult&&(this.lastMult=t,t>1&&this.events.push({type:`elixirRate`,mult:t}));for(let r of this.players){let i=n.elixirPerSecond*t*e;r.elixir>=n.maxElixir&&(r.elixirLeaked+=i),r.elixir=Math.min(n.maxElixir,r.elixir+i),this.fillHand(r)}this.updateSpells(),this.updateAreas(),this.updateRollers(),this.updateBombs();for(let e of this.entities)e.alive&&this.updateEntity(e);this.resolveCollisions(),this.updateProjectiles(),this.entities=this.entities.filter(e=>e.alive||e.kind===`tower`),this.projectiles=this.projectiles.filter(e=>!e.done),this.updateClock()}updateClock(){if(this.phase===`ended`||(this.timeLeft=Math.max(0,this.timeLeft-e),this.timeLeft>0))return;let[t,r]=[this.players[0].crowns,this.players[1].crowns];t===r?this.phase===`regular`?(this.phase=`overtime`,this.timeLeft=n.overtime,this.events.push({type:`phase`,phase:`overtime`})):this.startTiebreak():this.finish(t>r?0:1,this.phase===`regular`?`time`:`overtime`)}startTiebreak(){let e=e=>Math.min(...this.towers(e).filter(e=>e.alive).map(e=>e.hp)),t=e(0),r=e(1);if(Math.abs(t-r)<1e-6)this.finish(null,`draw`);else{for(let e of this.entities)e.kind!==`tower`&&e.alive&&(e.alive=!1);this.entities=this.entities.filter(e=>e.kind===`tower`),this.projectiles=[],this.spells=[],this.areas=[],this.rollers=[],this.bombs=[],this.phase=`tiebreak`,this.drainRate=Math.min(t,r)/n.tiebreakDrainTime,this.events.push({type:`phase`,phase:`tiebreak`})}}updateTiebreak(){let t=this.drainRate*e;for(let e of this.entities)e.alive&&(e.hp-=t);let n=this.entities.filter(e=>e.alive&&e.hp<=0);for(let e of n)this.kill(e);if(n.length&&this.phase===`tiebreak`){let[e,t]=[this.players[0].crowns,this.players[1].crowns];this.finish(e===t?null:e>t?0:1,e===t?`draw`:`tiebreak`)}}finish(e,t){this.phase!==`ended`&&(this.phase=`ended`,this.result={winner:e,crowns:[this.players[0].crowns,this.players[1].crowns],reason:t,time:this.time},this.events.push({type:`end`,result:this.result}))}updateSpells(){for(let t of this.spells){if(t.delay>0){if(t.delay-=e,t.delay>0)continue}else if(t.waveTimer-=e,t.waveTimer>0)continue;let n=f[t.cardId].spell,r=(n.waves??1)-t.wavesLeft+1;if(n.kind===`lightning`)this.strike(t,n)||(t.wavesLeft=1);else if(n.kind===`barrel`){this.events.push({type:`spell`,team:t.team,cardId:t.cardId,x:t.x,y:t.y,radius:n.radius,wave:r});let e=n.spawn,i=A(e.count);for(let[n,r]of i)this.spawnUnit(t.team,e.unit,t.cardId,t.x+n,t.y+r,e.deployTime,`barrel`)}else this.applySpell(t.team,t.cardId,n,t.x,t.y,r);t.wavesLeft--,t.waveTimer=n.waveInterval??0}this.spells=this.spells.filter(e=>e.wavesLeft>0)}strike(e,t){let n=null;for(let r of this.entities)!r.alive||r.team===e.team||r.tunneling||e.struck?.includes(r.id)||r.stats.flying&&!t.hitsAir||O(e.x,e.y,r)>t.radius||(!n||r.hp>n.hp)&&(n=r);return n?((e.struck??(e.struck=[])).push(n.id),this.events.push({type:`strike`,team:e.team,cardId:e.cardId,x:n.x,y:n.y,targetId:n.id}),this.applyDamage(n,n.kind===`tower`?Math.round(t.damage*t.towerPct):t.damage),n.alive&&t.stun&&this.stun(n,t.stun,!1),!0):!1}applySpell(e,t,n,r,i,a){this.events.push({type:`spell`,team:e,cardId:t,x:r,y:i,radius:n.radius,wave:a});for(let t of this.entities){if(!t.alive||t.team===e||t.tunneling||t.stats.flying&&!n.hitsAir||O(r,i,t)>n.radius)continue;let a=t.kind===`tower`?Math.round(n.damage*n.towerPct):n.damage;a>0&&this.applyDamage(t,a),t.alive&&(n.stun&&this.stun(t,n.stun,!!n.freeze),n.pushback&&this.knockback(t,r,i,n.pushback,!1))}}updateAreas(){for(let t of this.areas){t.timeLeft-=e,t.tickTimer-=e;let n=f[t.cardId].spell;if(n.rage){if(t.tickTimer<=0){t.tickTimer+=n.tick??.3;for(let e of this.entities)e.alive&&e.team===t.team&&e.kind!==`tower`&&!e.tunneling&&(O(t.x,t.y,e)>t.radius||(e.rageTimer=Math.max(e.rageTimer,n.rage.linger),e.rageMul=n.rage.mul))}}else{for(let e of this.entities)!e.alive||e.team===t.team||e.kind!==`troop`||e.tunneling||e.stats.flying&&!n.hitsAir||O(t.x,t.y,e)>t.radius||n.slow&&(e.slowTimer=Math.max(e.slowTimer,.25),e.slowMul=Math.min(e.slowMul,1-n.slow));if(!(t.tickTimer>0||t.ticksLeft<=0)){t.tickTimer+=n.tick??1,t.ticksLeft--,this.events.push({type:`spell`,team:t.team,cardId:t.cardId,x:t.x,y:t.y,radius:t.radius,wave:0});for(let e of this.entities)!e.alive||e.team===t.team||e.tunneling||e.stats.flying&&!n.hitsAir||O(t.x,t.y,e)>t.radius||this.applyDamage(e,e.kind===`tower`?Math.round(n.damage*n.towerPct):n.damage)}}}this.areas=this.areas.filter(e=>e.timeLeft>0||e.ticksLeft>0)}updateRollers(){for(let t of this.rollers){let n=f[t.cardId].spell,r=n.speed*e;t.traveled=Math.min(n.rollRange,t.traveled+r),t.y=t.startY+t.dir*t.traveled;for(let e of this.entities){if(!e.alive||e.team===t.team||e.stats.flying||e.tunneling||t.hit.has(e.id))continue;let r=e.half>0?Math.max(0,Math.abs(e.x-t.x)-e.half):Math.max(0,Math.abs(e.x-t.x)-e.stats.radius),i=e.half>0?Math.max(0,Math.abs(e.y-t.y)-e.half):Math.max(0,Math.abs(e.y-t.y)-e.stats.radius);r>n.radius||i>n.rollHalfDepth||(t.hit.add(e.id),this.applyDamage(e,e.kind===`tower`?Math.round(n.damage*n.towerPct):n.damage),e.alive&&e.kind===`troop`&&this.knockback(e,e.x,e.y-t.dir,n.pushback??0,!0))}}this.rollers=this.rollers.filter(e=>e.traveled<f[e.cardId].spell.rollRange-1e-6)}updateBombs(){for(let t of this.bombs)t.timer-=e,!(t.timer>0)&&this.blast(t.team,t.unit,t.x,t.y);this.bombs=this.bombs.filter(e=>e.timer>0)}blast(e,t,n,r){let i=d[t].stats.deathDamage;this.events.push({type:`blast`,team:e,unit:t,x:n,y:r,radius:i.radius,visual:i.visual});for(let t of this.entities)t.alive&&t.team!==e&&!t.tunneling&&(t.stats.flying||O(n,r,t)>i.radius||(this.applyDamage(t,t.kind===`tower`?Math.round(i.damage*i.towerMul):i.damage),t.alive&&i.pushback>0&&this.knockback(t,n,r,i.pushback,!1)))}canTarget(e,t){if(!t.alive||t.team===e.team||t.tunneling)return!1;let n=e.stats.targets;return n===`buildings`?t.kind!==`troop`:n!==`ground`||!t.stats.flying}edgeDist(e,t){return O(e.x,e.y,t)-e.stats.radius}acquireTarget(e){let t=e.targetId>=0?this.get(e.targetId):void 0;t&&!this.canTarget(e,t)&&(t=void 0);let n=e.stats.speed===0;if(t&&e.locked){let r=this.edgeDist(e,t);if(n?r<=e.stats.range+.05:r<=Math.max(e.stats.sight,e.stats.range)+1)return t}let r=null,i=1/0,a=n?e.stats.range:e.stats.sight;for(let t of this.entities){if(!this.canTarget(e,t))continue;let n=this.edgeDist(e,t);n>a||n<i&&(i=n,r=t)}if(!r&&!n)for(let t of this.entities){if(!t.alive||t.team===e.team||t.kind!==`tower`)continue;let n=this.edgeDist(e,t);n<i&&(i=n,r=t)}return r&&r.id===e.targetId||(e.attacking=!1,e.locked=!1,e.rampTime=0),e.targetId=r?r.id:-1,r}updateEntity(t){if(t.tunneling){this.updateTunnel(t);return}let n=1;if(t.rageTimer>0&&(t.rageTimer-=e,n=t.rageMul,t.rageTimer<=0&&(t.rageMul=1)),t.cooldown=Math.max(0,t.cooldown-e*n),t.moving=!1,t.slowTimer>0&&(t.slowTimer-=e,t.slowTimer<=0&&(t.slowMul=1)),t.lifetime!==1/0&&(t.lifetime-=e,t.hp-=t.maxHp/(t.stats.lifetime??1)*e,t.hp<=0||t.lifetime<=0)){this.kill(t);return}if(t.kbTime>0){let n=Math.min(e,t.kbTime)/c;t.x+=t.kbx*n,t.y+=t.kby*n,t.kbTime-=e;return}if(t.deployTimer>0){t.deployTimer-=e;return}if(t.stunTimer>0){t.stunTimer-=e,t.stunTimer<=0&&(t.frozen=!1);return}if(t.kind===`tower`&&!t.active)return;if(t.kind===`tower`&&t.activateTimer>0){t.activateTimer-=e;return}if(this.updateSpawner(t,n),this.updateElixirGen(t),t.stats.damage<=0&&!t.stats.ramp)return;let r=this.acquireTarget(t);r&&(this.edgeDist(t,r)<=t.stats.range?(t.facing=Math.atan2(r.y-t.y,r.x-t.x),t.attacking||(t.attacking=!0,t.cooldown=Math.max(t.cooldown,t.stats.loadTime)),t.locked=!0,t.chargeDist=0,t.stats.ramp&&(t.rampTime+=e),t.cooldown<=0&&(this.attack(t,r),t.cooldown=t.stats.hitSpeed)):(t.attacking=!1,t.stats.speed>0&&this.moveToward(t,r)))}updateTunnel(t){let n=t.tunnelX-t.x,r=t.tunnelY-t.y,i=Math.hypot(n,r),a=(t.stats.tunnelSpeed??10)*e;i>a?(t.x+=n/i*a,t.y+=r/i*a,t.facing=Math.atan2(r,n)):(t.x=t.tunnelX,t.y=t.tunnelY,t.tunneling=!1,t.deployTimer=t.stats.deployTime,t.facing=t.team===0?-Math.PI/2:Math.PI/2,this.events.push({type:`emerge`,id:t.id,team:t.team,x:t.x,y:t.y}))}updateElixirGen(t){let n=t.stats.elixirGen;n&&(t.genTimer-=e,!(t.genTimer>0)&&(t.genTimer+=n.interval,this.giveElixir(t.team,n.amount,t.x,t.y)))}giveElixir(e,t,r,i){let a=this.players[e],o=n.maxElixir-a.elixir;t>o&&(a.elixirLeaked+=t-Math.max(0,o)),a.elixir=Math.min(n.maxElixir,a.elixir+t),a.elixirGained+=t,this.events.push({type:`elixir`,team:e,x:r,y:i,amount:t})}updateSpawner(t,n=1){let r=t.stats.spawner;if(r){if(t.spawnLeft>0){if(t.spawnGap-=e*n,t.spawnGap>0)return;this.spawnOne(t,r.count-t.spawnLeft,r.count),t.spawnLeft--,t.spawnGap=r.interval}else if(t.spawnTimer-=e*n,!(t.spawnTimer>0)){if(t.spawnTimer=r.pause,r.interval<=0)for(let e=0;e<r.count;e++)this.spawnOne(t,e,r.count);else this.spawnOne(t,0,r.count),t.spawnLeft=r.count-1,t.spawnGap=r.interval}}}spawnOne(e,t,n){let r=e.stats.spawner,i=e.team===0?-1:1,a,o;if(e.kind===`building`)a=e.x+(t%2==0?-.6:.6),o=e.y+i*(e.half+.6);else{let r=t/n*Math.PI*2+Math.PI/4;a=e.x+Math.cos(r)*1.1,o=e.y+Math.sin(r)*1.1}this.spawnUnit(e.team,r.unit,r.unit,a,o,.3,`spawner`)}attack(e,t){let n=e.stats,r=!!n.projectile,i=e.charging&&!!n.charge;if(e.lastAttack=this.time,this.events.push({type:`attack`,id:e.id,unit:e.unit,team:e.team,x:e.x,y:e.y,tx:t.x,ty:t.y,targetId:t.id,ranged:r,charge:i}),i&&(e.charging=!1,e.chargeDist=0),n.kamikaze){if(r)this.launch(e,t,n.damage);else{let e=i?n.charge.damage:n.damage;t.kind===`tower`&&n.towerMul!==void 0&&(e=Math.round(e*n.towerMul)),this.applyDamage(t,e)}e.alive=!1,e.hp=0,this.events.push({type:`death`,id:e.id,team:e.team,kind:e.kind,unit:e.unit,x:e.x,y:e.y,kamikaze:!0}),this.deathEffects(e);return}if(r){this.launch(e,t,n.damage);return}let a=i?n.charge.damage:n.damage;if(t.kind===`tower`&&n.towerMul!==void 0&&(a=Math.round(a*n.towerMul)),n.ramp){let t=Math.min(2,Math.floor(e.rampTime/n.ramp.stageTime));a=n.ramp.damages[t]}if(n.splash){let r=n.splashSelf?e.x:t.x,i=n.splashSelf?e.y:t.y;this.areaDamage(e.team,r,i,n.splash,a,n.targets===`air-ground`,!0)}else this.applyDamage(t,a)}launch(e,t,n){let r=e.stats.projectile;this.projectiles.push({id:this.nextId++,team:e.team,x:e.x,y:e.y,sx:e.x,sy:e.y,targetId:t.id,tx:t.x,ty:t.y,speed:r.speed,damage:n,splash:r.splash??0,freeze:r.freeze??0,hitsAir:e.stats.targets===`air-ground`,hitsGround:!0,visual:r.visual,arc:r.arc??0,source:e.unit,done:!1})}areaDamage(e,t,n,r,i,a,o,s=0){for(let c of this.entities)c.alive&&c.team!==e&&!c.tunneling&&((c.stats.flying?!a:!o)||O(t,n,c)>r||(this.applyDamage(c,i),s>0&&c.alive&&this.stun(c,s,!0)))}updateProjectiles(){for(let t of this.projectiles){if(t.done)continue;let n=this.get(t.targetId);n&&n.alive&&(t.tx=n.x,t.ty=n.y);let r=D(t.x,t.y,t.tx,t.ty),i=t.speed*e;r>i?(t.x+=(t.tx-t.x)/r*i,t.y+=(t.ty-t.y)/r*i):(t.x=t.tx,t.y=t.ty,t.done=!0,this.playing&&(t.splash>0?(this.events.push({type:`impact`,team:t.team,x:t.tx,y:t.ty,radius:t.splash,visual:t.visual}),this.areaDamage(t.team,t.tx,t.ty,t.splash,t.damage,t.hitsAir,t.hitsGround,t.freeze)):n&&n.alive&&(this.applyDamage(n,t.damage),t.freeze>0&&n.alive&&this.stun(n,t.freeze,!0))))}}applyDamage(e,t){e.alive&&this.playing&&(e.hp-=t,this.events.push({type:`hit`,id:e.id,team:e.team,x:e.x,y:e.y,amount:t,isTower:e.kind===`tower`,isBuilding:e.kind===`building`}),e.kind===`tower`&&e.unit===`king`&&this.activateKing(e),e.hp<=0&&this.kill(e))}activateKing(e){!e.active&&e.alive&&(e.active=!0,e.activateTimer=i,this.events.push({type:`kingActivate`,team:e.team}))}stun(e,t,n){e.alive&&(e.stunTimer=Math.max(e.stunTimer,t),e.frozen=n||e.frozen,e.attacking=!1,e.locked=!1,e.cooldown=Math.max(e.cooldown,e.stats.loadTime),e.charging=!1,e.chargeDist=0,e.rampTime=0,this.events.push({type:`stun`,id:e.id,freeze:n}))}knockback(e,t,n,r,i){if(e.kind!==`troop`||e.stats.flying||r<=0||e.stats.ignorePushback&&!i)return;let a=e.x-t,o=e.y-n,s=Math.hypot(a,o);s<1e-6&&(a=0,o=e.team===0?1:-1,s=1),e.kbx=a/s*r,e.kby=o/s*r,e.kbTime=c,e.attacking=!1,e.locked=!1,e.charging=!1,e.chargeDist=0,e.cooldown=Math.max(e.cooldown,e.stats.loadTime)}kill(e){if(!e.alive)return;if(e.alive=!1,e.hp=0,this.events.push({type:`death`,id:e.id,team:e.team,kind:e.kind,unit:e.unit,x:e.x,y:e.y,kamikaze:!1}),e.kind!==`tower`){this.deathEffects(e);return}let t=+(e.team===0),n=e.unit===`king`;if(this.events.push({type:`towerDown`,team:e.team,isKing:n,x:e.x,y:e.y,cascade:!1}),n){for(let t of this.towers(e.team))t.alive&&(t.alive=!1,t.hp=0,this.events.push({type:`towerDown`,team:t.team,isKing:!1,x:t.x,y:t.y,cascade:!0}));this.players[t].crowns=3,this.finish(t,`king`)}else this.players[t].crowns++,this.activateKing(this.king(e.team)),this.phase===`overtime`&&this.finish(t,`overtime`)}deathEffects(e){let t=e.stats;if(t.elixirGen?.onDeath&&this.giveElixir(e.team,t.elixirGen.onDeath,e.x,e.y),t.deathDamage){if(t.deathDamage.delay>0){let n={id:this.nextId++,team:e.team,unit:e.unit,x:e.x,y:e.y,timer:t.deathDamage.delay,total:t.deathDamage.delay};this.bombs.push(n),this.events.push({type:`bombDrop`,id:n.id,team:e.team,unit:e.unit,x:e.x,y:e.y,delay:n.total})}else this.blast(e.team,e.unit,e.x,e.y)}if(t.deathSpawn){let n=t.deathSpawn.count;for(let r=0;r<n;r++){let i=r/n*Math.PI*2+Math.PI/2,a=e.half>0?e.half*.6:.6;this.spawnUnit(e.team,t.deathSpawn.unit,t.deathSpawn.unit,e.x+Math.cos(i)*a,e.y+Math.sin(i)*a,.5,`death`)}}}sideOf(e){return e>=t.riverBottom?1:e<=t.riverTop?-1:0}nearestBridge(e){let[n,r]=t.bridgeXs;return Math.abs(e-n)<=Math.abs(e-r)?n:r}waypoint(e,n,r){if(e.stats.flying||e.stats.jumpsRiver)return[n,r];let i=this.sideOf(e.y),a=this.sideOf(r),{riverTop:o,riverBottom:s,bridgeHalfWidth:c}=t;if(i!==0&&(a===i||a===0))return a===0?[n,i>0?s+.05:o-.05]:[n,r];if(i===0){let t=this.nearestBridge(e.x);return a===0?[Math.max(t-c,Math.min(t+c,n)),r]:[e.x,a>0?s+.3:o-.3]}let l=t.bridgeXs[0],u=1/0;for(let r of t.bridgeXs){let t=Math.abs(e.x-r)+Math.abs(n-r);t<u-1e-6&&(u=t,l=r)}let d=i>0?s+.4:o-.4,f=i>0?o-.4:s+.4,p=c-e.stats.radius*.6;return Math.abs(e.x-l)<=p+.02&&Math.abs(e.y-d)<1.2?[Math.max(l-p+.05,Math.min(l+p-.05,e.x)),f]:[Math.max(l-p+.05,Math.min(l+p-.05,e.x)),d]}moveToward(t,n){let[r,i]=this.waypoint(t,n.x,n.y),a=D(t.x,t.y,r,i);if(a<1e-6)return;let o=(r-t.x)/a,s=(i-t.y)/a;t.stats.flying||([o,s]=this.steerAround(t,n,o,s,a));let c=t.stats.speed*t.slowMul*(t.rageTimer>0?t.rageMul:1);t.stats.charge&&t.charging&&(c*=t.stats.charge.speedMul);let l=Math.min(a,c*e);t.x+=o*l,t.y+=s*l,t.moving=l>1e-6,t.facing=Math.atan2(s,o),t.stats.charge&&!t.charging&&(t.chargeDist+=l,t.chargeDist>=t.stats.charge.distance&&(t.charging=!0,this.events.push({type:`charge`,id:t.id})))}steerAround(e,t,n,r,i){let a=null,o=1/0,s=0;for(let c of this.entities){if(!c.alive||c===t||c.kind===`troop`)continue;let l=c.half*1.2+e.stats.radius+.1,u=c.x-e.x,d=c.y-e.y,f=u*n+d*r;if(f<-.2||f>i+l)continue;let p=n*d-r*u;Math.abs(p)>=l||f<o&&(o=f,a=c,s=p)}if(!a)return e.avoidSide=0,[n,r];if(e.avoidSide===0){if(Math.abs(s)>.05)e.avoidSide=s>0?-1:1;else{let t=-r;e.avoidSide=(w/2-a.x)*t>=0?1:-1}}let c=a.half*1.2+e.stats.radius+.3,l=-r*e.avoidSide,u=n*e.avoidSide,d=a.x+l*c-e.x,f=a.y+u*c-e.y,p=Math.hypot(d,f);return p<1e-6?[n,r]:[d/p,f/p]}resolveCollisions(){let e=this.entities.filter(e=>e.alive&&e.kind===`troop`&&!e.tunneling);for(let t=0;t<e.length;t++){let n=e[t];for(let r=t+1;r<e.length;r++){let t=e[r];if(n.stats.flying!==t.stats.flying)continue;let i=t.x-n.x,a=t.y-n.y,o=n.stats.radius+t.stats.radius,c=i*i+a*a;if(c>=o*o)continue;let l=Math.sqrt(c),u=i,d=a;l<1e-6&&(u=n.id<t.id?.7:-.7,d=.7,l=1);let f=(o-Math.sqrt(c))*s,p=n.stats.mass+t.stats.mass,m=t.stats.mass/p,h=n.stats.mass/p;n.x-=u/l*f*m,n.y-=d/l*f*m,t.x+=u/l*f*h,t.y+=d/l*f*h}}for(let t of e)this.constrain(t,!1)}constrain(e,n){let r=e.stats.radius;if(e.x=Math.max(r,Math.min(w-r,e.x)),e.y=Math.max(r,Math.min(T-r,e.y)),e.jumping=!1,e.stats.flying)return;for(let t of this.entities){if(t===e||!t.alive||t.half<=0)continue;let n=t.half+r,i=e.x-t.x,a=e.y-t.y;if(Math.abs(i)>=n||Math.abs(a)>=n)continue;let o=Math.max(-t.half,Math.min(t.half,i)),s=Math.max(-t.half,Math.min(t.half,a)),c=i-o,l=a-s,u=Math.hypot(c,l);u>0&&u<r?(e.x=t.x+o+c/u*r,e.y=t.y+s+l/u*r):u>=r||(n-Math.abs(i)<n-Math.abs(a)?e.x=t.x+Math.sign(i||(e.team===0?1:-1))*n:e.y=t.y+Math.sign(a||(e.team===0?1:-1))*n)}let{riverTop:i,riverBottom:a}=t;if(e.y>i&&e.y<a){if(e.stats.jumpsRiver&&!n&&e.kbTime<=0){e.jumping=!0;return}let o=this.nearestBridge(e.x),s=t.bridgeHalfWidth-r*.6;Math.abs(e.x-o)>s+.01&&(!n&&e.py>i&&e.py<a?e.x=Math.max(o-s,Math.min(o+s,e.x)):e.y=(n?e.y:e.py)>=(i+a)/2?a:i)}}stateHash(){let e=[this.tick.toString(),this.phase,this.timeLeft.toFixed(4)];for(let t of this.players)e.push(t.elixir.toFixed(4),t.hand.join(`,`),t.queue.join(`,`),t.crowns.toString());for(let t of this.entities)e.push(`${t.id}:${t.unit}:${t.x.toFixed(4)}:${t.y.toFixed(4)}:${t.hp.toFixed(2)}:${+!!t.alive}`);for(let t of this.projectiles)e.push(`p${t.id}:${t.x.toFixed(4)}:${t.y.toFixed(4)}`);let t=2166136261,n=e.join(`|`);for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0).toString(16)}},ee=new Map;function M(e){let t=ee.get(e);if(t)return t;let n=f[e],r=n.unit?d[n.unit].stats:void 0,i=n.spell,a=n.count??1,o=r?r.ramp?r.ramp.damages[1]:r.damage:0,s={id:e,def:n,cost:n.cost,kind:n.kind,st:r,spell:i,count:a,hp:r?r.hp*a:0,dps:r&&r.hitSpeed>0?o*a/r.hitSpeed:0,splash:r?r.splash??r.projectile?.splash??0:i?.radius??0,hitsAir:n.kind===`spell`?!!i?.hitsAir:r.targets===`air-ground`,flying:!!r?.flying,ranged:!!r&&r.range>=3,hunter:r?.targets===`buildings`,swarm:!!r&&a>=3&&r.hp<=400,tank:!!r&&n.kind===`troop`&&a===1&&r.hp>=2500,bruiser:!!r&&n.kind===`troop`&&a===1&&r.hp>=1200&&r.hp<2500&&r.targets!==`buildings`,spirit:!!r?.kamikaze&&!!r.projectile,win:r?.targets===`buildings`||i?.kind===`barrel`||!!r?.charge||!!r?.tunnelSpeed,damageSpell:n.kind===`spell`&&!!i&&i.kind!==`barrel`&&i.damage>0&&!i.freeze&&!i.rage,freeze:!!i?.freeze,rage:!!i?.rage,pump:!!r?.elixirGen,tunnel:!!r?.tunnelSpeed};return ee.set(e,s),s}var N=(()=>{let e={},t=(t,n)=>{e[t]=Math.min(e[t]??1/0,n)};for(let e of Object.values(f)){if(!e.unit)continue;let n=d[e.unit].stats;t(e.unit,e.cost/(e.count??1));let r=n.deathSpawn;if(r){let i=d[r.unit].stats.hp*r.count;t(r.unit,e.cost*(i/(n.hp+i))/r.count)}}return e})();function P(e,t){let n=f[t];if(n){if(n.kind===`spell`)return n.cost/(n.spell?.spawn?.count??1);if(n.unit===e){let t=d[e].stats,r=t.deathSpawn,i=r?t.hp/(t.hp+d[r.unit].stats.hp*r.count):1;return n.cost*i/(n.count??1)}}return N[e]??.3}function F(e){switch(e){case 1:return[[0,0]];case 2:return[[-.6,0],[.6,0]];case 3:return[[0,-.55],[-.6,.4],[.6,.4]];case 4:return[[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]];case 5:return[[0,0],[-.8,-.6],[.8,-.6],[-.8,.6],[.8,.6]];default:{let t=[[0,0]],n=Math.min(6,e-1);for(let e=0;e<n;e++){let r=e/n*Math.PI*2;t.push([Math.cos(r)*.9,Math.sin(r)*.9])}let r=e-1-n;for(let e=0;e<r;e++){let n=e/r*Math.PI*2+.3;t.push([Math.cos(n)*1.75,Math.sin(n)*1.75])}return t}}}function te(e,t,n=8){let r=e.waves??1;return e.kind===`area`?(t?Math.round(e.damage*e.towerPct):e.damage)*Math.min(n,Math.round((e.duration??1)/(e.tick??1))):(t?Math.round(e.damage*e.towerPct):e.damage)*r}function ne(e,t,n,r,i,a){let o=r.half??0;if(n!==`troop`&&o>0){let n=Math.max(0,Math.abs(e-i)-o),r=Math.max(0,Math.abs(t-a)-o);return Math.hypot(n,r)}return Math.max(0,Math.hypot(e-i,t-a)-r.radius)}function re(e,t,n,r){let i,a=1/0;for(let o of e.entities){if(o.kind!==`tower`||!o.alive||o.team!==t)continue;let e=O(n,r,o);e<a&&(a=e,i=o)}return i}function ie(e,t,n){if(n<=0||!t.alive||t.stats.speed<=0)return[t.x,t.y];let r=n-Math.max(t.deployTimer,t.stunTimer,t.kbTime);if(r<=0)return[t.x,t.y];let i=t.targetId>=0?e.get(t.targetId):void 0;if(i&&i.alive||(i=re(e,+(t.team===0),t.x,t.y)),!i||t.attacking&&e.edgeDist(t,i)<=t.stats.range+.05)return[t.x,t.y];let a=t.stats.speed*(t.slowTimer>0?t.slowMul:1);t.charging&&t.stats.charge&&(a*=t.stats.charge.speedMul);let o=r*a,s=t.x,c=t.y,l={x:s,y:c,stats:t.stats};for(let n=0;n<8&&o>.001;n++){let n=O(s,c,i)-t.stats.radius-t.stats.range;if(n<=0)break;l.x=s,l.y=c;let[r,a]=e.waypoint(l,i.x,i.y),u=Math.hypot(r-s,a-c);if(u<1e-4)break;let d=Math.min(o,u,Math.max(.1,n));s+=(r-s)/u*d,c+=(a-c)/u*d,o-=d}return[s,c]}function I(e,t,n){if(!t.e||t.kind!==`troop`)return[t.x,t.y];let r=Math.max(0,Math.round(n*10)),i=t.pred.get(r);if(i)return i;let a=ie(e,t.e,r/10);return t.pred.set(r,a),a}function ae(e,t,n,r,i,a={}){let o=a.hp??n.hp,s=a.ready??0;return{side:e,kind:t,st:n,x:r,y:i,hp:o,hp0:o,maxHp:n.hp,value:a.value??0,ready:s,exists:a.exists??0,alive:o>0,active:a.active??!0,target:null,locked:!1,attacking:!1,nextHit:0,rampT:a.rampT??0,moved:0,charging:!!a.charging,spawnAt:s+(n.spawner?.start??0),repickAt:0,ref:a.ref??-1,lockRef:a.lockRef??-1}}function oe(e,t,n){let r=n.st.half??0;if(n.kind!==`troop`&&r>0){let i=Math.max(0,Math.abs(e-n.x)-r),a=Math.max(0,Math.abs(t-n.y)-r);return Math.hypot(i,a)}return Math.max(0,Math.hypot(e-n.x,t-n.y)-n.st.radius)}function se(e,t){return oe(e.x,e.y,t)-e.st.radius}function ce(e,t){let n=e.st.targets;return n===`buildings`?t.kind!==`troop`:n!==`ground`||!t.st.flying}var le=i+.7;function ue(e,t=11,n=.2,r=[],i){let a=[],o=[...r].sort((e,t)=>e.at-t.at);for(let t of e){if(t.lockRef<0)continue;let n=e.find(e=>e.ref===t.lockRef&&e.side!==t.side);n&&(t.target=n,t.locked=!0)}let s=(t,n)=>{for(let r of e)r.kind===`tower`&&r.side===t&&r.alive&&!r.active&&(r.active=!0,r.ready=Math.max(r.ready,n+le))},c=(t,n,r,i,a,o)=>{let s=d[n].stats;e.push(ae(t,`troop`,s,r,i,{value:P(n,n),ready:a+o,exists:a}))},l=(e,t)=>{e.alive=!1,e.hp=0;let n=e.st;if(n.deathDamage&&a.push({at:t+n.deathDamage.delay,side:e.side,x:e.x,y:e.y,st:n}),n.deathSpawn){let r=n.deathSpawn.count;for(let i=0;i<r;i++){let a=i/r*Math.PI*2;c(e.side,n.deathSpawn.unit,e.x+Math.cos(a)*.6,e.y+Math.sin(a)*.6,t,.5)}}e.kind===`tower`&&s(e.side,t)},u=(e,t,n)=>{!e.alive||n<e.exists||(e.hp-=t,e.kind===`tower`&&!e.active&&s(e.side,n),e.hp<=0&&l(e,n))},f=(t,n)=>{let r=t.st.speed<=0,i=r?t.st.range:t.st.sight,a=null,o=1/0;for(let r=0;r<e.length;r++){let s=e[r];if(!s.alive||s.side===t.side||n<s.exists||!ce(t,s))continue;let c=se(t,s);c<=i&&c<o&&(o=c,a=s)}if(a||r)return a;for(let n=0;n<e.length;n++){let r=e[n];if(!r.alive||r.side===t.side||r.kind!==`tower`)continue;let i=se(t,r);i<o&&(o=i,a=r)}return a},p=(t,n,r)=>{let i=t.st,a=i.damage;t.charging&&i.charge&&(a=i.charge.damage,t.charging=!1,t.moved=0),i.ramp&&(a=i.ramp.damages[Math.min(2,Math.floor(t.rampT/i.ramp.stageTime))]);let o=i.splash??i.projectile?.splash??0,s=i.projectile?.freeze??0;if(o>0){let c=i.splashSelf?t.x:n.x,l=i.splashSelf?t.y:n.y,d=i.targets===`air-ground`;for(let n=0;n<e.length;n++){let i=e[n];!i.alive||i.side===t.side||r<i.exists||i.st.flying&&!d||oe(c,l,i)>o||(u(i,a,r),s>0&&i.alive&&(i.ready=Math.max(i.ready,r+s)))}}else u(n,a,r),s>0&&n.alive&&(n.ready=Math.max(n.ready,r+s));i.kamikaze&&(t.alive=!1,t.hp=0)},m=t,h=Math.ceil(t/n);for(let t=0;t<h;t++){let r=t*n;for(;o.length&&o[0].at<=r+1e-9;){let e=o.shift();e.u.alive&&(u(e.u,e.dmg,r),e.stun>0&&e.u.alive&&(e.u.ready=Math.max(e.u.ready,r+e.stun),e.u.attacking=!1,e.u.rampT=0,e.u.charging=!1,e.u.moved=0))}for(let t=a.length-1;t>=0;t--){let n=a[t];if(n.at>r)continue;a.splice(t,1);let i=n.st.deathDamage;for(let t=0;t<e.length;t++){let a=e[t];!a.alive||a.side===n.side||a.st.flying||r<a.exists||oe(n.x,n.y,a)>i.radius||u(a,a.kind===`tower`?Math.round(i.damage*i.towerMul):i.damage,r)}}let s=0;for(let t=0;t<e.length;t++){let i=e[t];if(!i.alive||(i.side===1&&i.kind!==`tower`&&s++,r<i.ready||r<i.exists))continue;let a=i.st;if(i.kind===`building`&&a.lifetime&&(i.hp-=i.maxHp/a.lifetime*n,i.hp<=0)){l(i,r);continue}if(a.spawner&&r>=i.spawnAt){let e=a.spawner;for(let t=0;t<e.count;t++)c(i.side,e.unit,i.x+(t%2==0?-.6:.6),i.y+(i.side===0?.6:-.6),r,.3+t*e.interval);i.spawnAt=r+e.pause}if(i.kind===`tower`&&!i.active||a.damage<=0&&!a.ramp)continue;let o=a.speed<=0,u=i.target;if(u&&!u.alive&&(u=null),u&&i.locked){let e=se(i,u);(o?e>a.range+.05:e>Math.max(a.sight,a.range)+1)&&(u=null)}if((!u||!i.locked&&r>=i.repickAt)&&(u=f(i,r),i.repickAt=r+.4),u!==i.target&&(i.attacking=!1,i.locked=!1,i.rampT=0,i.target=u),!u)continue;let d=se(i,u);if(d<=a.range){i.attacking||(i.attacking=!0,i.nextHit=Math.max(i.nextHit,r+a.loadTime)),i.locked=!0,a.ramp&&(i.rampT+=n),r>=i.nextHit&&(p(i,u,r),i.nextHit=r+a.hitSpeed),i.moved=0;continue}if(i.attacking=!1,o)continue;let m=a.speed*(i.charging&&a.charge?a.charge.speedMul:1),h=Math.min(d-a.range+.02,m*n),g=u.x-i.x,_=u.y-i.y,v=Math.hypot(g,_)||1;i.x+=g/v*h,i.y+=_/v*h,a.charge&&(i.moved+=h,i.moved>=a.charge.distance&&(i.charging=!0))}if(i&&t%5==0&&i(`${r.toFixed(1)} ${e.filter(e=>e.alive).map(e=>`${e.side}:${e.kind===`tower`?`T`:``}${e.st.hp}@${e.x.toFixed(1)},${e.y.toFixed(1)}:${Math.round(e.hp)}${e.attacking?`*`:``}`).join(` `)}`),s===0&&a.length===0&&o.length===0){m=r;break}}let g={towerDamage:0,towersLost:0,enemyTowerDamage:0,enemyRemain:0,ourRemain:0,clearTime:m};for(let t of e){if(t.kind===`tower`){t.side===0?(g.towerDamage+=t.hp0-Math.max(0,t.hp),t.alive||g.towersLost++):g.enemyTowerDamage+=t.hp0-Math.max(0,t.hp);continue}let e=t.alive?Math.max(0,t.hp)/t.maxHp:0;t.side===1?(g.enemyRemain+=t.value*e,t.alive&&t.attacking&&t.target?.kind===`tower`&&t.st.hitSpeed>0&&(g.towerDamage+=t.st.damage/t.st.hitSpeed*4)):g.ourRemain+=t.value*e}return g}function de(e,t,n,r,i){if(n.kind===`instant`||n.kind===`area`||n.kind===`roll`||n.speed<=0)return 0;let a=e.king(t);return Math.hypot(a.x-r,a.y-i)/n.speed}function fe(e,t){if(e.hp<=0)return 0;let n=e.value*(Math.min(t,e.hp)/e.maxHp);return t>=e.hp&&(n+=e.value*.3),n}function pe(e,t){return!!e.e&&e.kind===`troop`&&e.st.speed>0&&!e.e.attacking&&e.e.deployTimer<t}function me(e){return e.kind!==`troop`||!e.e||e.e.attacking||e.st.speed<=0?8:Math.max(2,Math.min(8,Math.round(4/e.st.speed+e.e.deployTimer)))}function he(e,t,n,r,i,a){let o=e.game,s=e.delay??0,c={cardId:t,x:i,y:a,land:0,value:0,hits:[],towerDmg:0,tower:null},l=[];for(let t of r){if(t.appear>s+1.2)continue;let[r,c]=I(o,t,s+.5*e.aim);ne(i,a,t.kind,t.st,r,c)>n.radius||l.push({hp:t.hp,foe:t})}for(let t of e.towers)O(i,a,t)<=n.radius&&l.push({hp:t.hp,tower:t});l.sort((e,t)=>t.hp-e.hp);for(let t of l.slice(0,n.bolts??3))if(t.foe){let r=t.foe,i=fe(r,n.damage)*(1+e.foeBonus(r));r.e&&r.st.ramp&&r.e.rampTime>=1.2?i+=2:r.e?.charging&&(i+=.8),c.hits.push({foe:r,dmg:n.damage}),c.value+=i}else if(t.tower){let r=te(n,!0);c.towerDmg=r,c.tower=t.tower,c.value+=e.towerValue(t.tower,r)}return c}function ge(e,t,n,r,i,a){if(n.bolts)return he(e,t,n,r,i,a);let o=e.game,s=de(o,e.team,n,i,a),c=e.delay??0,l=c+s*e.aim,u=Math.max(.35,Math.min(1,1.25-.25*s)),d={cardId:t,x:i,y:a,land:s,value:0,hits:[],towerDmg:0,tower:null},f=s+(n.waves??1)*(n.waveInterval??0);for(let t of r){if(t.appear>c+f+.02)continue;let[r,p]=I(o,t,l);if(ne(i,a,t.kind,t.st,r,p)>n.radius)continue;let m=te(n,!1,n.kind===`area`?me(t):8),h=fe(t,m)*(1+e.foeBonus(t));pe(t,s)&&(h*=u),n.stun&&t.e&&(t.st.ramp&&t.e.rampTime>=1.2?h+=2:t.e.charging?h+=.8:h+=.1),d.hits.push({foe:t,dmg:m}),d.value+=h}for(let t of e.towers){if(O(i,a,t)>n.radius)continue;let r=te(n,!0);d.towerDmg=Math.max(d.towerDmg,r),d.tower=t,d.value+=e.towerValue(t,r)}return d}function _e(e,n,r,i){let a=e.game,o=e.team===0?-1:1,s=e.delay??0,c=i.filter(e=>!e.st.flying),l=new Set,u=null,d=(t,i)=>{let[d,f]=a.snap(n,t,i),p=`${d},${f}`;if(l.has(p))return;l.add(p);let m={cardId:n,x:d,y:f,land:0,value:0,hits:[],towerDmg:0,tower:null};for(let t of c){if(t.appear>s+.6)continue;let[n,i]=I(a,t,s+.5*e.aim),c=t.kind!==`troop`&&(t.st.half??0)>0?t.st.half:t.st.radius;if(Math.abs(n-d)-c>r.radius)continue;let l=(i-f)*o;l<-(r.rollHalfDepth+c)||l>r.rollRange+r.rollHalfDepth+c||(m.hits.push({foe:t,dmg:r.damage}),m.value+=fe(t,r.damage)*(1+e.foeBonus(t)))}for(let t of e.towers){let n=(t.y-f)*o;if(Math.abs(t.x-d)-t.half>r.radius||n<-(r.rollHalfDepth+t.half)||n>r.rollRange+r.rollHalfDepth+t.half)continue;let i=te(r,!0);m.towerDmg=i,m.tower=t,m.value+=e.towerValue(t,i)}(!u||m.value>u.value)&&(u=m)};for(let n of c){if(n.appear>s+.6)continue;let[r,i]=I(a,n,s+.5*e.aim),c=i-o*(n.st.radius+.35);for(let e of[0,-.9,.9])d(Math.max(.5,Math.min(t.width-.5,r+e)),c)}return u}function ve(e,t,n){let r=M(t),i=r.spell;if(!i||!r.damageSpell)return null;let a=(n??e.foes).filter(e=>e.hp>0&&(i.hitsAir||!e.st.flying));if(i.kind===`roll`)return _e(e,t,i,a);let o=e.game,s=t=>{let n=de(o,e.team,i,t.x,t.y);return I(o,t,(e.delay??0)+n*e.aim)},c=[],l=a.map(s);for(let e of l)c.push(e);let u=Math.min(l.length,14);for(let e=0;e<u;e++)for(let t=e+1;t<u;t++){let[n,r]=l[e],[a,o]=l[t];Math.hypot(n-a,r-o)<=i.radius*2&&c.push([(n+a)/2,(r+o)/2])}for(let t of e.towers){c.push([t.x,t.y]);for(let[e,n]of l)O(e,n,t)>i.radius*2||c.push([(e+t.x)/2,(n+t.y)/2])}let d=new Set,f=null;for(let[n,r]of c){let[s,c]=o.snap(t,n,r),l=`${s},${c}`;if(d.has(l))continue;d.add(l);let u=ge(e,t,i,a,s,c);(!f||u.value>f.value)&&(f=u)}return f}var ye=class{constructor(e,t,r,i){S(this,`game`,void 0),S(this,`team`,void 0),S(this,`rng`,void 0),S(this,`accuracy`,void 0),S(this,`elixir`,n.startElixir),S(this,`plays`,[]),S(this,`seen`,new Set),S(this,`lastPlay`,{time:-99,cardId:``,x:0,y:0}),S(this,`spent`,0),S(this,`played`,0),S(this,`gained`,0),S(this,`time`,0),S(this,`maxId`,0),this.game=e,this.team=t,this.rng=r,this.accuracy=i}update(){let e=this.game,t=e.players[this.team],r=e.time-this.time;if(this.time=e.time,r>0&&(this.elixir=Math.min(n.maxElixir,this.elixir+n.elixirPerSecond*e.elixirMultiplier()*r)),t.elixirGained!==this.gained&&(this.elixir=Math.min(n.maxElixir,this.elixir+(t.elixirGained-this.gained)),this.gained=t.elixirGained),t.cardsPlayed===this.played)return;let i=t.cardsPlayed-this.played,a=t.elixirSpent-this.spent;this.played=t.cardsPlayed,this.spent=t.elixirSpent,this.identify(i,a);let o=a;this.rng.next()>this.accuracy&&(o+=(this.rng.next()<.5?-1:1)*(1+this.rng.int(2))),this.elixir=Math.max(0,Math.min(n.maxElixir,this.elixir-o))}identify(e,t){let n=this.game,r=[],i=this.maxId,a=0,o=0,s=(e,t,n,s,c,l)=>{if(e<=this.maxId||(i=Math.max(i,e),t!==this.team))return;let u=f[n];u&&u.kind===`spell`===l&&!r.includes(n)&&(r.push(n),a=s,o=c)};for(let e of n.entities)s(e.id,e.team,e.cardId,e.x,e.y,!1);for(let e of n.spells)s(e.id,e.team,e.cardId,e.x,e.y,!0);for(let e of n.areas)s(e.id,e.team,e.cardId,e.x,e.y,!0);for(let e of n.rollers)s(e.id,e.team,e.cardId,e.x,e.y,!0);this.maxId=i;let c=r.reduce((e,t)=>e+f[t].cost,0);if(r.length<e&&t-c>0){let e=t-c,n=Object.values(f).filter(t=>t.kind===`spell`&&t.spell?.kind===`instant`&&t.cost===e);n.length===1&&r.push(n[0].id)}for(let e of r)this.plays.push(e),this.seen.add(e),this.lastPlay={time:n.time,cardId:e,x:a,y:o};this.plays.length>40&&this.plays.splice(0,this.plays.length-40)}recent(){return this.plays.slice(-4)}mayHold(e){return this.seen.has(e)&&!this.recent().includes(e)}},be={easy:{reaction:2.8,reactDelay:2.8,skill:0,noise:3,aim:0,track:0,pushElixir:10,spellValue:2.5,leak:10,counterPush:0,minGain:4,plan:1,pocket:!1},normal:{reaction:1,reactDelay:.8,skill:.6,noise:1,aim:.5,track:.5,pushElixir:7.4,spellValue:1.1,leak:9.7,counterPush:.75,minGain:.8,plan:2,pocket:!1},hard:{reaction:.4,reactDelay:.12,skill:.95,noise:.25,aim:1,track:1,pushElixir:7.4,spellValue:1.25,leak:9.4,counterPush:.95,minGain:.35,plan:5,pocket:!0}},L=be.normal,xe=[0,.8,1.6,2.6,3.8],Se=(()=>{let e=[];for(let t=-4;t<=4;t++)for(let n=-4;n<=4;n++){let r=Math.hypot(t,n);r<=4.3&&e.push([t,n,r+(n<0?.3:0)])}return e.sort((e,t)=>e[2]-t[2]||t[1]-e[1]||e[0]-t[0]),e.map(([e,t])=>[e,t])})(),Ce=class{constructor(e,t,n,r=L){S(this,`game`,void 0),S(this,`team`,void 0),S(this,`rng`,void 0),S(this,`opts`,void 0),S(this,`thinkTimer`,void 0),S(this,`model`,void 0),S(this,`seenAt`,new Map),S(this,`maxSeen`,0),S(this,`lane`,void 0),S(this,`lastPrune`,0),S(this,`trace`,null),S(this,`clashTrace`,null),S(this,`why`,``),S(this,`lastBoost`,-99),this.game=e,this.team=t,this.rng=n,this.opts=r,this.thinkTimer=1+n.range(0,1),this.model=new ye(e,+(t===0),n,r.track),this.lane=n.int(2)}get enemyElixirEstimate(){return this.model.elixir}get knownEnemyCards(){return[...this.model.seen]}update(){this.game.playing&&(this.model.update(),this.noticeNew(),this.thinkTimer-=e,!(this.thinkTimer>0)&&(this.thinkTimer=this.opts.reaction*this.rng.range(.7,1.3),this.think()))}get enemy(){return+(this.team===0)}vy(e){return E(this.team,e)}wy(e){return E(this.team,e)}laneOf(e){return e<t.width/2?0:1}chance(e){return this.rng.next()<e}noticeNew(){let e=this.game,t=e.entities,n=this.maxSeen;for(let r=t.length-1;r>=0;r--){let i=t[r];if(i.id<=this.maxSeen)break;i.id>n&&(n=i.id),i.team!==this.team&&this.seenAt.set(i.id,e.time)}this.maxSeen=n;for(let t of e.spells)t.team!==this.team&&!this.seenAt.has(t.id)&&this.seenAt.set(t.id,e.time);if(e.time-this.lastPrune>10){this.lastPrune=e.time;for(let[t,n]of this.seenAt)e.time-n>5&&!e.get(t)&&!e.spells.some(e=>e.id===t)&&this.seenAt.delete(t)}}think(){let e=this.situation();if(e.hand.length!==0){if(this.why=``,this.finisher(e))return this.report(e,`finish`);if(this.defend(e))return this.report(e,`defend`);if(this.boost(e))return this.report(e,`boost`);if(this.tiebreakChip(e)||this.chipTower(e))return this.report(e,`chip`);if(this.valueSpell(e))return this.report(e,`spell`);if(this.support(e))return this.report(e,`support`);if(this.pump(e))return this.report(e,`pump`);if(this.push(e,!1))return this.report(e,`push`);this.avoidLeak(e)&&this.report(e,`leak`)}}boost(e){let t=this.game;if(t.time-this.lastBoost<3||!this.chance(.2+this.opts.skill*.8))return!1;let n=e.threats.some(e=>e.eta<5&&e.value>=3),r=e.hand.find(t=>t.ci.rage&&t.ci.cost<=e.elixir-(n?2:0)),i=e.hand.find(t=>t.ci.freeze&&t.ci.cost<=e.elixir-(n?2:0));if(!r&&!i)return!1;for(let n of t.towers(this.enemy)){if(!n.alive)continue;let a=t.entities.filter(e=>e.alive&&e.team===this.team&&e.kind===`troop`&&!e.tunneling&&e.deployTimer<=0&&O(e.x,e.y,n)<=Math.max(e.stats.range,1)+2.5);if(a.length===0)continue;let o=a.reduce((e,t)=>e+P(t.unit,t.cardId)*(t.hp/t.maxHp),0),s=a.reduce((e,t)=>e+t.x,0)/a.length,c=a.reduce((e,t)=>e+t.y,0)/a.length;if(i&&o>=3.5){let r=(s+n.x)/2,a=(c+n.y)/2;if(O(r,a,n)<=i.ci.spell.radius-.3&&(e.foes.filter(e=>e.e&&Math.hypot(e.x-r,e.y-a)<=3.2).reduce((e,t)=>e+t.value*(t.hp/t.maxHp),0)>=2||n.hp<n.maxHp*.5))return this.lastBoost=t.time,this.castSpell(i,r,a,!0)}if(r&&a.length>=2&&o>=4)return this.lastBoost=t.time,this.castSpell(r,s,c,!0)}return!1}pump(e){let t=e.hand.find(t=>t.ci.pump&&t.ci.cost<=e.elixir);if(!t||e.threats.some(e=>e.eta<10)||e.mult<2&&e.elixir<Math.min(9.5,t.ci.cost+2.5)||this.game.entities.filter(e=>e.alive&&e.team===this.team&&e.stats.elixirGen).length>=2)return!1;let n=this.lane===0?1:-1;return this.deployOwn(t,9+n*4.5,30.5)}deployTunnel(e,n){let r=this.game,i=r.towers(this.enemy).filter(e=>e.alive&&e.unit===`princess`),a=i.find(e=>e.lane===n)??i.sort((e,t)=>e.hp-t.hp)[0]??r.king(this.enemy),o=a.x<t.width/2?-1:1,s=this.team===0?-1:1,c=a.half+.5;for(let[t,n]of[[o*c,0],[0,s*c],[-o*c,0],[0,-s*c]]){let i=this.opts.noise*.3,[o,s]=r.snap(e.id,a.x+t+this.rng.range(-i,i),a.y+n+this.rng.range(-i,i));if(!r.canDeployAt(this.team,e.id,o,s))continue;let c=r.deploy(this.team,e.index,o,s).ok;return c&&this.trace&&(this.why+=` => ${e.id}@${o.toFixed(1)},${this.vy(s).toFixed(1)}`),c}return!1}report(e,t){if(!this.trace)return;let n=e.threats.map(e=>`L${e.lane}:eta${e.eta.toFixed(1)}/v${e.value.toFixed(1)}`).join(` `);this.trace(`${t} e=${e.elixir.toFixed(1)} est=${e.enemyElixir.toFixed(1)} ${this.why} [${n}]`)}situation(){let e=this.game,r=e.players[this.team],i=e.elixirMultiplier(),a=[];r.hand.forEach((e,t)=>{e&&a.push({index:t,id:e,ci:M(e)})});let o=this.snapshotFoes(),s={now:e.time,elixir:r.elixir,rate:n.elixirPerSecond*i,mult:i,overtime:e.phase===`overtime`,hand:a,foes:o,threats:[],enemyElixir:this.model.elixir,hold:0,lead:r.crowns-e.players[this.enemy].crowns,spellCtx:void 0};return s.spellCtx={game:e,team:this.team,foes:o,towers:e.towers(this.enemy).filter(e=>e.alive),aim:this.opts.aim,towerValue:(e,t)=>this.towerDamageValue(e,t,s),foeBonus:e=>this.vy(e.y)>=t.riverTop?.35:0},s.threats=this.findThreats(s),s}snapshotFoes(){let e=this.game,t=[],n=this.opts.reactDelay;for(let r of e.entities){if(!r.alive||r.team===this.team||r.kind===`tower`)continue;let i=this.seenAt.get(r.id);if(!(i===void 0||e.time-i<n)){if(r.tunneling){let e=Math.hypot(r.tunnelX-r.x,r.tunnelY-r.y)/(r.stats.tunnelSpeed??10);t.push({e:null,unit:r.unit,cardId:r.cardId,st:r.stats,kind:r.kind,x:r.tunnelX,y:r.tunnelY,hp:r.hp,maxHp:r.maxHp,value:P(r.unit,r.cardId),appear:e,deploy:r.stats.deployTime,pred:new Map})}else t.push({e:r,unit:r.unit,cardId:r.cardId,st:r.stats,kind:r.kind,x:r.x,y:r.y,hp:r.hp,maxHp:r.maxHp,value:P(r.unit,r.cardId),appear:0,deploy:r.deployTimer,pred:new Map})}}for(let r of e.spells){if(r.team===this.team)continue;let i=f[r.cardId]?.spell;if(!i||i.kind!==`barrel`||!i.spawn)continue;let a=this.seenAt.get(r.id);if(a===void 0||e.time-a<n)continue;let o=d[i.spawn.unit].stats;for(let[e,n]of F(i.spawn.count))t.push({e:null,unit:i.spawn.unit,cardId:r.cardId,st:o,kind:`troop`,x:r.x+e,y:r.y+n,hp:o.hp,maxHp:o.hp,value:P(i.spawn.unit,r.cardId),appear:Math.max(0,r.delay),deploy:i.spawn.deployTime,pred:new Map})}return this.applyPending(t),t.filter(e=>e.hp>0)}applyPending(e){let t=this.game;for(let n of t.spells){if(n.team!==this.team)continue;let r=f[n.cardId].spell;if(r.kind===`barrel`)continue;let i=Math.max(0,n.delay);for(let a of e){if(a.st.flying&&!r.hitsAir)continue;let[e,o]=I(t,a,i);ne(n.x,n.y,a.kind,a.st,e,o)>r.radius||(a.hp-=r.damage*n.wavesLeft)}}for(let n of t.areas){if(n.team!==this.team)continue;let t=f[n.cardId].spell;for(let r of e)r.st.flying&&!t.hitsAir||ne(n.x,n.y,r.kind,r.st,r.x,r.y)>n.radius||(r.hp-=t.damage*Math.min(n.ticksLeft,4))}for(let n of t.rollers){if(n.team!==this.team)continue;let t=f[n.cardId].spell,r=t.rollRange-n.traveled;for(let i of e){if(i.st.flying||i.e&&n.hit.has(i.e.id)||Math.abs(i.x-n.x)-i.st.radius>t.radius)continue;let e=(i.y-n.y)*n.dir;e<-(t.rollHalfDepth+i.st.radius)||e>r+1||(i.hp-=t.damage)}}}defendTower(e){return this.game.towers(this.team).find(t=>t.unit===`princess`&&t.lane===e&&t.alive)??this.game.king(this.team)}incoming(e){if(!e.e||this.vy(e.y)>=13)return!0;let t=e.e.targetId>=0?this.game.get(e.e.targetId):void 0;return!t||!t.alive||t.team===this.team&&(t.kind!==`troop`||this.vy(t.y)>=13)}timeToHit(e){if(!e.e)return e.appear+e.deploy;let t=this.game,n=e.e,r=n.targetId>=0?t.get(n.targetId):void 0;if(r&&r.alive&&r.team===this.team||(r=re(t,this.team,n.x,n.y)),!r)return 1/0;if(n.attacking)return 0;let i=Math.max(0,t.edgeDist(n,r)-n.stats.range),a=n.stats.flying||n.stats.jumpsRiver?1:1.15,o=Math.max(.2,n.stats.speed*(n.slowTimer>0?n.slowMul:1));return Math.max(0,n.deployTimer,n.stunTimer)+i*a/o}findThreats(e){let t=this.game,n=[];for(let r of[0,1]){let i=e.foes.filter(e=>e.kind===`troop`&&this.laneOf(e.x)===r&&this.incoming(e));if(i.length===0)continue;let a=1/0,o=i[0],s=-1/0,c=0;for(let e of i){a=Math.min(a,this.timeToHit(e));let n=this.vy(I(t,e,1)[1]);n>s&&(s=n,o=e),c+=e.value*(e.hp/e.maxHp)}n.push({lane:r,foes:i,front:o,frontVy:s,eta:a,value:c,hunters:i.filter(e=>e.st.targets===`buildings`).sort((e,t)=>this.vy(t.y)-this.vy(e.y)),troopHitters:i.some(e=>e.st.targets!==`buildings`&&e.st.damage>0),tower:this.defendTower(r)})}return n}reserve(e){if(e.elixir>=9.6)return 0;let t=e.hold;return t=this.opts.track>=.5?Math.max(t,Math.min(4,e.enemyElixir-4)):Math.max(t,1.5),e.overtime&&(t+=1),e.mult>=2&&--t,Math.max(0,t)}towerDamageValue(e,t,n){if(t>=e.hp)return e.unit===`king`||n.overtime?60:12;let r=t/230;return n.overtime&&this.game.timeLeft<25&&(r*=2.5),r}hpPerElixir(e,t){let n=190;return e.hp<1300&&(n*=.65),e.unit===`king`&&(n*=.7),t.overtime&&(n*=.6),n}spellRisk(e){if(!e.st||this.opts.track<.5)return 0;let t=this.model.seen.size<8?.2:0;for(let n of this.model.seen){let r=M(n);!r.damageSpell||!this.model.mayHold(n)||r.cost>this.model.elixir+.5||(!e.flying||r.spell.hitsAir)&&te(r.spell,!1,4)>=e.st.hp&&(t=Math.max(t,.8))}return t}enemyMayHoldHunter(){if(this.opts.track<.5)return!1;for(let e of this.model.seen)if(M(e).hunter&&this.model.mayHold(e))return!0;return!1}pendingTowerDamage(e){let t=this.game,n=0;for(let r of t.spells){if(r.team!==this.team)continue;let t=f[r.cardId].spell;t.kind!==`barrel`&&O(r.x,r.y,e)<=t.radius&&(n+=Math.round(t.damage*t.towerPct)*(t.bolts?1:r.wavesLeft))}for(let r of t.areas){if(r.team!==this.team||O(r.x,r.y,e)>r.radius)continue;let t=f[r.cardId].spell;n+=Math.round(t.damage*t.towerPct)*r.ticksLeft}for(let r of t.rollers){if(r.team!==this.team||r.hit.has(e.id))continue;let t=f[r.cardId].spell,i=(e.y-r.y)*r.dir;Math.abs(e.x-r.x)-e.half<=t.radius&&i>=-e.half&&i<=t.rollRange-r.traveled+e.half&&(n+=Math.round(t.damage*t.towerPct))}return n}finisher(e){if(this.opts.skill<.5&&!this.chance(.5))return!1;let t=e.hand.filter(e=>e.ci.damageSpell);if(t.length===0)return!1;for(let n of this.game.towers(this.enemy)){if(!n.alive)continue;let r=n.hp-this.pendingTowerDamage(n);if(r<=0)continue;let i=null;for(let n of t)n.ci.cost>e.elixir||te(n.ci.spell,!0)>=r&&(!i||n.ci.cost<i.ci.cost)&&(i=n);if(!i)for(let n of t)for(let a of t)n===a||n.ci.cost>e.elixir||n.ci.cost+a.ci.cost>e.elixir+e.rate*1.5||te(n.ci.spell,!0)+te(a.ci.spell,!0)<r||(n.ci.spell.speed||1e9)<=(a.ci.spell.speed||1e9)&&(i=n);if(i)return this.castAtTower(e,i,n)}return!1}castAtTower(e,t,n){let r=t.ci.spell,i=ve(e.spellCtx,t.id);if(i&&i.tower===n)return this.castSpell(t,i.x,i.y,!1);if(r.kind===`roll`){let e=this.vy(n.y)+n.half+.5;return this.castSpell(t,n.x,this.wy(e),!1)}return this.castSpell(t,n.x,n.y,!1)}tiebreakChip(e){let t=this.game;if(!e.overtime||t.timeLeft>20||e.lead!==0)return!1;let n=Math.min(...t.towers(this.team).filter(e=>e.alive).map(e=>e.hp)),r=t.towers(this.enemy).filter(e=>e.alive).sort((e,t)=>e.hp-t.hp);if(r.length===0)return!1;let i=r[0],a=i.hp-this.pendingTowerDamage(i)-n;if(a<0)return!1;let o=e.hand.filter(t=>t.ci.damageSpell&&t.ci.cost<=e.elixir),s=e=>te(e.ci.spell,!0);o.sort((e,t)=>s(t)-s(e));let c=o.find(e=>s(e)>a)??(t.timeLeft<8?o[0]:void 0);return c?this.castAtTower(e,c,i):!1}chipTower(e){let t=this.game;if(e.mult<2&&!(t.timeLeft<30&&e.lead<=0)||e.threats.some(e=>e.eta<5&&e.value>=2))return!1;let n=t.towers(this.enemy).filter(e=>e.alive).sort((e,t)=>e.hp-t.hp);if(n.length===0)return!1;let r=n[0],i=r.hp-this.pendingTowerDamage(r);if(i<=0)return!1;let a=null,o=0;for(let t of e.hand){if(!t.ci.damageSpell||t.ci.cost>e.elixir-Math.max(2.5,e.hold))continue;let n=te(t.ci.spell,!0);if(i>n*(e.overtime?8:3))continue;let r=n/t.ci.cost;r>o&&(o=r,a=t)}return!a||o<35?!1:this.castAtTower(e,a,r)}defend(e){let t=e.threats.filter(e=>e.eta<11).sort((e,t)=>e.eta-t.eta);for(let n of t)if(this.planDefense(e,n))return!0;for(let t of e.threats)t.eta>=11&&t.value>=4&&(e.hold=Math.max(e.hold,3));return!1}planDefense(e,t){let n=this.score(this.clash(t,null,null,0),0,t,e),r=[];for(let i of e.hand){let a=this.defOption(e,t,i,n);a&&r.push(a)}if(r.length===0)return!1;r.sort((e,t)=>t.gain-e.gain);let i=r[0];if(i.gain<this.opts.minGain)return!1;if(!this.chance(this.opts.skill)){let e=r.filter(e=>e.gain>Math.min(0,i.gain-4));i=this.rng.pick(e)}return this.trace&&(this.why=`L${t.lane} ${r.map(e=>`${e.h.id}:${e.gain.toFixed(1)}${e.delay?`(+${e.delay})`:``}`).join(` `)}`),i.delay===0?this.execDefense(i):(i.delay<5&&(e.hold=Math.max(e.hold,i.h.ci.cost)),!1)}defOption(e,t,n,r){let i=n.ci;if(i.kind===`spell`?!i.damageSpell:i.hunter||!i.st||i.pump)return null;let a=null;for(let o of xe.slice(0,Math.max(1,this.opts.plan))){if(i.cost>e.elixir+e.rate*o+1e-6)continue;if(o>0&&o>t.eta+1.5)break;let s,c=null,l=null;if(i.kind===`spell`){if(c=ve({...e.spellCtx,delay:o},n.id,t.foes),!c||c.hits.length===0||c.value<.5)continue;s=this.score(this.clash(t,null,c,o),i.cost,t,e)-r,i.cost>=4&&c.hits.length<=1&&!c.tower&&(s-=.8)}else l=this.defPlace(i,t,o),s=this.score(this.clash(t,{ci:i,place:l},null,o),i.cost,t,e)-r,i.swarm&&(s-=this.spellRisk(i)*i.cost*.5),i.cost<=2&&t.foes.length<=2&&t.front.st.hp>=1200&&t.front.st.targets!==`buildings`&&(s+=.5),i.kind===`building`&&t.hunters.length===0&&this.enemyMayHoldHunter()&&--s;s-=o*.15,(!a||s>a.gain)&&(a={h:n,gain:s,plan:c,place:l,delay:o})}return a}execDefense(e){return e.plan?this.castSpell(e.h,e.plan.x,e.plan.y,!0):this.deployOwn(e.h,e.place.x,e.place.vy)}score(e,t,n,r){let i=this.hpPerElixir(n.tower,r);return-e.towerDamage/i-e.towersLost*(r.overtime?40:8)+e.enemyTowerDamage/400-e.enemyRemain*.75+e.ourRemain*.5-t}nearThreat(e,t){for(let n of t.foes)if(Math.hypot(e.x-n.x,e.y-n.y)<=8)return!0;return!1}clash(e,t,n,r){let i=this.game,a=[],[o,s]=I(i,e.front,1);for(let t of i.towers(this.team))t.alive&&(t.unit===`princess`&&t.lane!==e.lane&&O(o,s,t)>t.stats.range+2||a.push(ae(0,`tower`,t.stats,t.x,t.y,{hp:t.hp,active:t.active,ready:t.activateTimer,ref:t.id,lockRef:t.locked?t.targetId:-1})));let c=i.towers(this.enemy).find(t=>t.alive&&t.unit===`princess`&&t.lane===e.lane);c&&a.push(ae(1,`tower`,c.stats,c.x,c.y,{hp:c.hp,ref:c.id}));for(let t of i.entities)t.alive&&t.team===this.team&&t.kind!==`tower`&&this.nearThreat(t,e)&&a.push(ae(0,t.kind,t.stats,t.x,t.y,{hp:t.hp,value:P(t.unit,t.cardId),ready:Math.max(t.deployTimer,t.stunTimer),ref:t.id,lockRef:t.locked?t.targetId:-1,charging:t.charging,rampT:t.rampTime}));if(t){let e=t.ci.st,n=this.team===0?1:-1,i=t.place.x,o=this.wy(t.place.vy),s=P(t.ci.def.unit,t.ci.id),c=t.ci.kind===`building`?`building`:`troop`;for(let[l,u]of F(c===`building`?1:t.ci.count))a.push(ae(0,c,e,i+l,o+u*n,{value:s,ready:r+e.deployTime+.1,exists:r}))}let l=[],u=n?f[n.cardId].spell.stun??0:0;for(let t of e.foes){let e=t.e,i=ae(1,t.kind,t.st,t.x,t.y,{hp:t.hp,value:t.value,ready:e?Math.max(e.deployTimer,e.stunTimer,e.kbTime):t.appear+t.deploy,exists:e?0:t.appear,ref:e?e.id:-1,lockRef:e&&e.locked?e.targetId:-1,charging:!!e?.charging,rampT:e?.rampTime??0});if(a.push(i),n)for(let e of n.hits)e.foe===t&&l.push({u:i,dmg:e.dmg,at:r+n.land,stun:u})}return ue(a,11,.2,l,this.clashTrace??void 0)}defPlace(e,n,r){let i=this.game,a=e.st,o=n.lane===0?1:-1,s=n.tower.x,c=this.vy(n.tower.y),[l,u]=I(i,n.front,r+a.deployTime+.3),d=this.vy(u),f=n.front.st,p=(e,n)=>({x:Math.max(.5,Math.min(t.width-.5,e)),vy:Math.max(t.riverBottom+.5,Math.min(t.height-.5,n))});if(e.kind===`building`){let t=n.hunters.find(e=>!e.e?.locked);if(t){let i=this.pullSpot(e,n,t,r);if(i)return p(i[0],i[1])}return p(s+o*2.5,c-3)}if(e.spirit)return p(l,d+2);let m=n.foes.some(e=>e.st.targets===`air-ground`&&e.st.damage>0);if(e.flying&&(!m||e.swarm))return p(l,d+1);if(e.ranged){let e=!n.troopHitters;return p(s+o*(e?2.5:1.5),e?c-1.5:c+3)}let h=f.hp>=1200&&!f.flying;return(e.swarm||e.count>=4)&&h?p(l,d+.6):f.targets===`buildings`&&!f.flying?p(l+o*.8,d+1.2):d<19.5?p(l+(t.width/2-l)*.35,20.5):p(l+o,d+1.5)}pullSpot(e,t,n,r){let i=this.game,a=t.lane===0?1:-1,[o,s]=I(i,n,r+e.st.deployTime),c=O(o,s,t.tower),l=e.st.half??1,u=[[9-a,21],[9-a,22],[9-2*a,21],[9,21],[9-2*a,22],[9-3*a,22],[9-2*a,23],[9-3*a,23]];for(let[t,r]of u){let[a,u]=i.snap(e.id,t,this.wy(r));if(!i.canDeployAt(this.team,e.id,a,u))continue;let d=Math.max(0,Math.abs(o-a)-l),f=Math.max(0,Math.abs(s-u)-l),p=Math.hypot(d,f);if(p<c-.6&&p<=n.st.sight+1.5)return[a,this.vy(u)]}return null}valueSpell(e){let t=null;for(let n of e.hand){if(!n.ci.damageSpell||n.ci.cost>e.elixir)continue;let r=ve(e.spellCtx,n.id);if(!r||r.value<n.ci.cost*this.opts.spellValue||r.hits.filter(e=>e.dmg>=e.foe.hp).length===0&&r.hits.length<2&&!r.tower||e.elixir-n.ci.cost<e.hold-.01&&r.value<n.ci.cost*1.8)continue;let i=r.value-n.ci.cost;(!t||i>t.score)&&(t={h:n,plan:r,score:i})}return t?this.castSpell(t.h,t.plan.x,t.plan.y,!0):!1}ownPush(e){return this.game.entities.filter(n=>{if(!n.alive||n.team!==this.team||n.kind!==`troop`||this.laneOf(n.x)!==e)return!1;let r=this.vy(n.y);return r>27||r<6?!1:r<t.riverTop||this.vy(n.y)<this.vy(n.py)-1e-4})}support(e){if(e.hand.length===0||!this.chance(this.opts.counterPush)||e.threats.some(e=>e.eta<4&&e.value>=2))return!1;let n=e.elixir-this.reserve(e);for(let r of[0,1]){let i=this.ownPush(r);if(i.length===0)continue;let a=i.reduce((e,t)=>e+P(t.unit,t.cardId)*(t.hp/t.maxHp),0);if(a<2.5)continue;let o=i.filter(e=>e.stats.hp>=1200||e.stats.targets===`buildings`).sort((e,t)=>this.vy(e.y)-this.vy(t.y))[0];if(o){let r=this.vy(o.y);if(r<14||r>25.5||i.filter(e=>e!==o&&(e.stats.range>=3||e.stats.flying)&&Math.hypot(e.x-o.x,e.y-o.y)<6).length>=(e.mult>=2||e.elixir>=7?2:1))continue;let a=this.bestSupport(e,n,e=>e.kind===`troop`&&!e.hunter&&(e.ranged||e.splash>0||e.flying&&e.swarm));if(a)return this.deployOwn(a,o.x,Math.max(t.riverBottom+.5,r+2.5));continue}let s=i.reduce((e,t)=>this.vy(t.y)<this.vy(e.y)?t:e),c=this.vy(s.y);if(c>23||a<3)continue;let l=this.bestSupport(e,n,e=>e.kind===`troop`&&(e.tank||e.bruiser||e.hunter)&&!e.flying);if(l)return this.deployOwn(l,s.x,Math.max(t.riverBottom+.5,c-1.5))}return!1}bestSupport(e,t,n){let r=null,i=-1/0,a=[...this.model.seen].some(e=>M(e).swarm),o=[...this.model.seen].some(e=>M(e).flying);for(let s of e.hand){let c=s.ci;if(c.cost>t||c.cost>e.elixir||!n(c))continue;let l=c.dps/120+(c.splash>0?1.2:0)+(c.ranged?.8:0)+c.hp/1500-c.cost*.35;a&&c.splash>0&&(l+=.8),o&&c.hitsAir&&(l+=.5),l+=this.rng.range(0,.4),l>i&&(i=l,r=s)}return r}attackLane(e){let t=this.game,n=[0,0];for(let e of[0,1]){let r=t.towers(this.enemy).find(t=>t.unit===`princess`&&t.lane===e);n[e]=r&&r.alive?r.hp:t.king(this.enemy).hp*.75;for(let t of this.ownPush(e))n[e]-=P(t.unit,t.cardId)*150}for(let t of e.foes)t.kind===`troop`&&t.value>=4&&this.vy(t.y)<13&&(n[this.laneOf(t.x)]+=500);return n[this.lane]-=150,this.lane=n[0]<=n[1]?0:1,this.lane}pocketOpen(e){return this.opts.pocket&&this.game.towers(this.enemy).some(t=>t.unit===`princess`&&t.lane===e&&!t.alive)}push(e,t){let n=this.game,r=e.threats.some(e=>e.eta<7&&e.value>=1.5),i=this.opts.track>=.5,a=i&&e.enemyElixir<=2.5&&!r,o=!1;if(!t){if(r)return!1;let t=this.opts.pushElixir;if(e.mult>=3?t-=3:e.mult>=2&&(t-=2),i&&e.elixir-e.enemyElixir>=3&&(t-=1.5),e.overtime&&e.mult<3&&(t+=.5),!e.overtime&&n.timeLeft<40&&(t+=e.lead<0?-2:e.lead>0?1.5:0),e.threats.some(e=>e.value>=4)&&(t+=1),o=!e.threats.some(e=>e.eta<9&&e.value>=2)&&e.elixir<t&&e.hand.some(t=>t.ci.tank&&e.elixir>=t.ci.cost+(e.mult>=2?.5:1.5)),e.elixir<t&&!a&&!o)return!1;if(e.elixir>=t||o)a=!1;else if(!e.hand.some(t=>(t.ci.win||t.ci.bruiser||t.ci.tank)&&t.ci.cost<=e.elixir-e.hold))return!1}let s=this.attackLane(e),c=t?e.elixir:e.elixir-(a?e.hold:this.reserve(e)),l=null,u=-1/0;for(let t of e.hand){let n=t.ci;if(n.cost>c||n.cost>e.elixir||n.kind===`building`||n.kind===`spell`&&n.spell?.kind!==`barrel`||a&&!(n.win||n.bruiser||n.tank)||o&&!n.tank)continue;let r=this.pushScore(n,e,a);r>u&&(u=r,l=t)}if(!l||u<0&&!t)return!1;if(!this.chance(this.opts.skill)){let t=e.hand.filter(t=>t.ci.cost<=c&&t.ci.cost<=e.elixir&&t.ci.kind===`troop`);t.length&&(l=this.rng.pick(t))}return this.pushDeploy(l,s,a||e.mult>=2)}pushScore(e,t,n){let r;if(e.spell?.kind===`barrel`){if(r=2.2+(n?2.5:0),this.opts.track>=.5){let e=0;for(let n of[`zap`,`log`,`arrows`,`fireball`,`poison`])this.model.mayHold(n)&&f[n].cost<=t.enemyElixir&&e++;r-=Math.min(2,e)*.8}}else e.tank?(r=3,t.elixir<e.cost+(t.mult>=2?0:1)&&(r-=5),t.mult>=2&&(r+=1)):r=e.win?2.6+(n?2.5:0):e.ranged&&!e.swarm?1.2:e.bruiser?1+ +!!n:e.swarm||e.spirit?.4+(n&&!e.spirit?.8:0):.6;return e.swarm&&(r-=this.spellRisk(e)*1.5),e.hitsAir&&this.opts.track>=.5&&[...this.model.seen].some(e=>M(e).flying&&M(e).win&&this.model.mayHold(e))&&t.hand.filter(t=>t.ci!==e&&t.ci.hitsAir&&t.ci.kind!==`spell`).length===0&&(r-=1.5),r+this.rng.range(0,.8)}pushDeploy(e,n,r){let i=this.game,a=e.ci,o=t.bridgeXs[n],s=n===0?1:-1;if(a.tunnel)return this.deployTunnel(e,n);if(a.spell?.kind===`barrel`){let t=i.towers(this.enemy).find(e=>e.unit===`princess`&&e.lane===n&&e.alive),r=t??i.king(this.enemy);return this.castSpell(e,r.x+(t?0:-s*1.2),this.wy(this.vy(r.y)+r.half+.7),!0)}return this.pocketOpen(n)&&(a.win||a.tank||a.bruiser)?this.deployOwn(e,o+s*1.5,11.5,!0,!0):a.tank?a.cost>=7||!r?this.deployOwn(e,a.cost>=7?9-s*1.5:o,a.cost>=7?31.5:28.5):this.deployOwn(e,o,18.5):a.win?this.deployOwn(e,o,a.st?.charge?20.5:a.flying?19.5:18.5):a.ranged?this.deployOwn(e,o+s*.5,29.5):a.bruiser?this.deployOwn(e,o,r?18.5:28.5):this.deployOwn(e,r?o:o-s*2.5,r?18.5:30.5)}avoidLeak(e){let r=this.opts.skill>=.5&&e.elixir+e.rate*this.opts.reaction*1.1>=n.maxElixir;if(e.elixir<this.opts.leak&&!r)return!1;if(this.push(e,!0))return!0;let i=e.hand.filter(t=>t.ci.kind===`troop`&&t.ci.cost<=e.elixir).sort((e,t)=>e.ci.cost-t.ci.cost);if(i.length)return this.deployOwn(i[0],t.bridgeXs[this.lane],30.5);let a=e.hand.find(t=>t.ci.kind===`building`&&!t.ci.pump&&t.ci.cost<=e.elixir);return a&&[...this.model.seen].some(e=>M(e).hunter)?this.deployOwn(a,9-(this.lane===0?1:-1),22):!1}deployOwn(e,n,r,i=!0,a=!1){let o=this.game;if(e.ci.cost>o.players[this.team].elixir)return!1;let s=i?this.opts.noise:0;s>0&&(n+=this.rng.range(-s,s),r+=this.rng.range(-s,s)*.6);for(let[i,s]of Se){let c=Math.max(.5,Math.min(t.width-.5,n+i)),l=Math.max(.5,Math.min(t.height-.5,r+s)),[u,d]=o.snap(e.id,c,this.wy(l));if(!a&&this.vy(d)-(e.ci.kind===`building`?e.ci.st?.half??1:0)<t.riverBottom||!o.canDeployAt(this.team,e.id,u,d))continue;let f=o.deploy(this.team,e.index,u,d).ok;return f&&this.trace&&(this.why+=` => ${e.id}@${u.toFixed(1)},${this.vy(d).toFixed(1)}`),f}return!1}castSpell(e,n,r,i){let a=this.game;if(e.ci.cost>a.players[this.team].elixir)return!1;let o=i?this.opts.noise*.35:0;o>0&&(n+=this.rng.range(-o,o),r+=this.rng.range(-o,o)),n=Math.max(.5,Math.min(t.width-.5,n)),r=Math.max(.5,Math.min(t.height-.5,r));let s=a.deploy(this.team,e.index,n,r).ok;return s&&this.trace&&(this.why+=` => ${e.id}@${n.toFixed(1)},${this.vy(r).toFixed(1)}`),s}},R={hit:.05,towerHit:.07,slash:.05,bow:.06,death:.08,bite:.06,punch:.08},we=class{constructor(){S(this,`ctx`,null),S(this,`master`,null),S(this,`sfx`,null),S(this,`musicGain`,null),S(this,`noiseBuf`,null),S(this,`lastPlayed`,new Map),S(this,`voices`,0),S(this,`muted`,!1),S(this,`musicOn`,!0),S(this,`music`,null)}unlock(){try{if(!this.ctx){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.55;let t=this.ctx.createDynamicsCompressor();t.threshold.value=-14,t.ratio.value=4,this.master.connect(t).connect(this.ctx.destination),this.sfx=this.ctx.createGain(),this.sfx.connect(this.master),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=.16,this.musicGain.connect(this.master);let n=this.ctx.sampleRate;this.noiseBuf=this.ctx.createBuffer(1,n,this.ctx.sampleRate);let r=this.noiseBuf.getChannelData(0);for(let e=0;e<n;e++)r[e]=Math.random()*2-1}this.ctx.state===`suspended`&&this.ctx.resume().catch(()=>void 0)}catch{this.ctx=null}}suspend(){this.ctx&&this.ctx.state===`running`&&this.ctx.suspend().catch(()=>void 0)}get state(){return this.ctx?this.ctx.state:`unavailable`}ready(){let e=this.ctx;return this.muted||!e||!this.sfx||e.state!==`running`?null:e}play(e){let t=this.ready();if(!t)return;let n=t.currentTime;if(n-(this.lastPlayed.get(e)??-1)<(R[e]??.06)||this.voices>26&&![`win`,`lose`,`tower`,`kingDown`,`crown`,`go`,`count`].includes(e))return;this.lastPlayed.set(e,n);let r=De[e];if(r){this.voices++,window.setTimeout(()=>this.voices=Math.max(0,this.voices-1),400);try{r(t,this.sfx,n+.005)}catch{}}}startMusic(){let e=this.ctx;if(!e||!this.musicGain||this.music)return;this.music={timer:0,next:e.currentTime+.1,step:0,tempo:118,intensity:0};let t=()=>{if(!this.music||!this.ctx)return;let e=this.ctx,t=this.music,n=60/t.tempo/2;for(;t.next<e.currentTime+.25;)!this.muted&&this.musicOn&&e.state===`running`&&je(e,this.musicGain,this.noiseBuf,t.step,t.next,n,t.intensity),t.next+=n,t.step=(t.step+1)%64};this.music.timer=window.setInterval(t,60),t()}setMusicIntensity(e){this.music&&(this.music.intensity=e,this.music.tempo=e>=2?136:e===1?126:118)}stopMusic(){this.music&&(clearInterval(this.music.timer),this.music=null)}};function z(e,t,n,r,i){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(Math.max(2e-4,r),t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+i)}function B(e,t,n,r,i,a,o,s,c=.005){let l=e.createOscillator(),u=e.createGain();l.type=r,l.frequency.setValueAtTime(i,n),a!==i&&l.frequency.exponentialRampToValueAtTime(Math.max(20,a),n+o),z(u,n,c,s,o),l.connect(u).connect(t),l.start(n),l.stop(n+c+o+.05)}var Te=null;function Ee(e){if(Te&&Te.sampleRate===e.sampleRate)return Te;let t=e.sampleRate;Te=e.createBuffer(1,t,e.sampleRate);let n=Te.getChannelData(0);for(let e=0;e<t;e++)n[e]=Math.random()*2-1;return Te}function V(e,t,n,r,i,a,o,s=o,c=1,l=.003){let u=e.createBufferSource();u.buffer=Ee(e),u.loop=!0;let d=e.createBiquadFilter();d.type=a,d.Q.value=c,d.frequency.setValueAtTime(o,n),s!==o&&d.frequency.exponentialRampToValueAtTime(Math.max(30,s),n+r);let f=e.createGain();z(f,n,l,i,r),u.connect(d).connect(f).connect(t),u.start(n,Math.random()*.5),u.stop(n+l+r+.05)}var De={tap:(e,t,n)=>B(e,t,n,`triangle`,880,990,.05,.22),rage:(e,t,n)=>{B(e,t,n,`sawtooth`,110,220,.38,.16),B(e,t,n+.04,`square`,165,330,.34,.08),V(e,t,n,.3,.18,`bandpass`,400,1400,1.4)},elixir:(e,t,n)=>{B(e,t,n,`sine`,620,1240,.12,.22),B(e,t,n+.07,`sine`,930,1650,.1,.16)},dig:(e,t,n)=>{V(e,t,n,.35,.4,`lowpass`,320,90,1),B(e,t,n+.05,`sine`,95,50,.3,.45)},error:(e,t,n)=>{B(e,t,n,`square`,220,180,.12,.12),B(e,t,n+.08,`square`,180,150,.12,.1)},deploy:(e,t,n)=>{V(e,t,n,.18,.35,`bandpass`,600,2400,1.2),B(e,t,n+.12,`sine`,160,70,.16,.5)},enemyDeploy:(e,t,n)=>{V(e,t,n,.15,.18,`bandpass`,500,1600,1.2),B(e,t,n+.1,`sine`,140,70,.14,.28)},thud:(e,t,n)=>{B(e,t,n,`sine`,120,40,.35,.8),V(e,t,n,.25,.3,`lowpass`,400,120)},slash:(e,t,n)=>{V(e,t,n,.08,.25,`bandpass`,3200,1400,2),B(e,t,n+.04,`triangle`,1400+Math.random()*300,900,.07,.08)},punch:(e,t,n)=>{B(e,t,n,`sine`,110,50,.18,.6),V(e,t,n,.12,.3,`lowpass`,900,200)},bite:(e,t,n)=>V(e,t,n,.06,.2,`bandpass`,1800,900,3),hit:(e,t,n)=>V(e,t,n,.06,.18,`bandpass`,1500+Math.random()*600,700,1.5),heavyHit:(e,t,n)=>{V(e,t,n,.12,.35,`lowpass`,2200,300),B(e,t,n,`sine`,95,45,.2,.5)},towerHit:(e,t,n)=>{V(e,t,n,.1,.22,`bandpass`,700,300,1),B(e,t,n,`sine`,180,90,.1,.18)},bow:(e,t,n)=>{B(e,t,n,`triangle`,420,260,.08,.16),V(e,t,n+.02,.1,.12,`highpass`,3e3,5e3,.7)},gun:(e,t,n)=>{V(e,t,n,.16,.55,`lowpass`,4e3,300,.7,.001),B(e,t,n,`square`,150,60,.08,.2)},cannon:(e,t,n)=>{B(e,t,n,`sine`,140,38,.38,.75),V(e,t,n,.3,.45,`lowpass`,1600,150,.7,.001)},fire:(e,t,n)=>V(e,t,n,.28,.3,`bandpass`,900,400,.8,.02),magic:(e,t,n)=>{B(e,t,n,`sine`,660,990,.18,.14),B(e,t,n+.05,`sine`,990,1320,.15,.1)},throw:(e,t,n)=>V(e,t,n,.12,.16,`bandpass`,900,2600,1.5,.02),beam:(e,t,n)=>B(e,t,n,`sawtooth`,90,120,.25,.06,.03),boom:(e,t,n)=>{V(e,t,n,.55,.65,`lowpass`,2600,120,.8,.002),B(e,t,n,`sine`,110,32,.5,.75)},bigBoom:(e,t,n)=>{V(e,t,n,1,.8,`lowpass`,3e3,80,.8,.002),B(e,t,n,`sine`,90,25,.9,.95),V(e,t,n+.12,.7,.3,`bandpass`,600,200,.6)},whoosh:(e,t,n)=>V(e,t,n,.4,.22,`bandpass`,400,1800,1.2,.12),arrows:(e,t,n)=>{for(let r=0;r<4;r++)V(e,t,n+r*.03,.08,.14,`highpass`,2500+r*300,4e3,.8)},zap:(e,t,n)=>{V(e,t,n,.3,.45,`highpass`,1800,6e3,.7,.001),B(e,t,n,`sawtooth`,220,80,.25,.22),B(e,t,n+.05,`square`,1800,600,.12,.08)},freeze:(e,t,n)=>{for(let r=0;r<4;r++)B(e,t,n+r*.04,`sine`,2200+r*380,2600+r*380,.18,.07);V(e,t,n,.25,.12,`highpass`,5e3,8e3,.7)},log:(e,t,n)=>{V(e,t,n,1.1,.35,`lowpass`,300,160,.7,.05),B(e,t,n,`sine`,60,50,1,.3,.05)},poison:(e,t,n)=>{for(let r=0;r<5;r++)B(e,t,n+r*.06,`sine`,300+Math.random()*200,500,.08,.08)},death:(e,t,n)=>{V(e,t,n,.2,.18,`bandpass`,900,300,1),B(e,t,n,`triangle`,520,180,.2,.08)},crumble:(e,t,n)=>{V(e,t,n,.5,.4,`lowpass`,1400,200,.7);for(let r=0;r<4;r++)V(e,t,n+.05+r*.07,.07,.16,`bandpass`,1200-r*150,600,2)},tower:(e,t,n)=>{V(e,t,n,1.3,.85,`lowpass`,2e3,70,.7,.002),B(e,t,n,`sine`,80,24,1.2,.95);for(let r=0;r<6;r++)V(e,t,n+.2+r*.09,.09,.22,`bandpass`,1400-r*120,500,2)},kingDown:(e,t,n)=>{De.tower(e,t,n),De.bigBoom(e,t,n+.25)},kingWake:(e,t,n)=>{B(e,t,n,`square`,392,392,.12,.08),B(e,t,n+.12,`square`,523,523,.18,.08)},fuse:(e,t,n)=>V(e,t,n,.5,.1,`highpass`,4e3,6e3,1,.05),charge:(e,t,n)=>{for(let r=0;r<4;r++)V(e,t,n+r*.09,.07,.25,`lowpass`,500,200,1);B(e,t,n,`sawtooth`,220,440,.25,.06)},phase:(e,t,n)=>{[784,988,1175,1568].forEach((r,i)=>B(e,t,n+i*.08,`triangle`,r,r,.16,.18))},overtime:(e,t,n)=>{[440,440,554,659].forEach((r,i)=>B(e,t,n+i*.14,`square`,r,r,.14,.1))},vs:(e,t,n)=>{V(e,t,n,.5,.3,`bandpass`,200,2400,1,.2),B(e,t,n+.45,`sine`,120,50,.45,.7)},count:(e,t,n)=>B(e,t,n,`square`,660,660,.12,.12),go:(e,t,n)=>{B(e,t,n,`square`,880,880,.3,.14),B(e,t,n,`sawtooth`,440,440,.3,.08),V(e,t,n,.4,.2,`bandpass`,800,3e3,1)},crown:(e,t,n)=>{[1047,1319,1568].forEach((r,i)=>B(e,t,n+i*.05,`triangle`,r,r,.25,.16))},win:(e,t,n)=>{[523,659,784,1047,784,1047].forEach((r,i)=>B(e,t,n+i*.13,`square`,r,r,i===5?.5:.16,.11)),[262,330,392].forEach(r=>B(e,t,n+.65,`triangle`,r,r,.7,.12))},lose:(e,t,n)=>{[392,370,349,262].forEach((r,i)=>B(e,t,n+i*.22,`triangle`,r,r*.98,i===3?.7:.22,.16))},thunder:(e,t,n)=>{V(e,t,n,1.1,.32,`lowpass`,900,120,1,.02),B(e,t,n+.05,`sawtooth`,70,40,.9,.12)},unlockArena:(e,t,n)=>{V(e,t,n,.6,.12,`bandpass`,1500,6e3,1,.05),[392,523,659,784,1047].forEach((r,i)=>B(e,t,n+.1+i*.09,`triangle`,r,r,i===4?.6:.18,.13)),[1568,2093].forEach((r,i)=>B(e,t,n+.6+i*.08,`sine`,r,r,.5,.06)),[262,330,392].forEach(r=>B(e,t,n+.55,`square`,r,r,.6,.05))},draw:(e,t,n)=>{[523,494,523].forEach((r,i)=>B(e,t,n+i*.18,`triangle`,r,r,.2,.14))}},Oe=[62,-1,65,67,69,-1,67,65,64,-1,62,-1,60,62,64,-1,62,-1,65,67,69,72,71,69,67,-1,65,-1,64,65,67,-1],ke=[38,38,41,41,43,43,36,36];function Ae(e){return 440*2**((e-69)/12)}function je(e,t,n,r,i,a,o){let s=r%8;if(s===0||s===4||o>=1&&s===6){let n=e.createOscillator(),r=e.createGain();n.frequency.setValueAtTime(130,i),n.frequency.exponentialRampToValueAtTime(42,i+.14),z(r,i,.003,.9,.16),n.connect(r).connect(t),n.start(i),n.stop(i+.2)}if(s===2||s===6){let r=e.createBufferSource();r.buffer=n;let a=e.createBiquadFilter();a.type=`bandpass`,a.frequency.value=1800;let o=e.createGain();z(o,i,.002,.45,.12),r.connect(a).connect(o).connect(t),r.start(i,Math.random()*.4),r.stop(i+.16)}if(o>=1||r%2==0){let r=e.createBufferSource();r.buffer=n;let a=e.createBiquadFilter();a.type=`highpass`,a.frequency.value=7e3;let o=e.createGain();z(o,i,.001,.12,.04),r.connect(a).connect(o).connect(t),r.start(i,Math.random()*.4),r.stop(i+.06)}if(r%2==0){let n=ke[Math.floor(r/8)%ke.length],o=e.createOscillator(),s=e.createGain();o.type=`triangle`,o.frequency.value=Ae(n),z(s,i,.01,.5,a*1.6),o.connect(s).connect(t),o.start(i),o.stop(i+a*2)}let c=Oe[r%Oe.length];if(c>0&&(r>=32||o>=1)){let n=e.createOscillator(),r=e.createBiquadFilter(),s=e.createGain();n.type=`square`,n.frequency.value=Ae(c+(o>=2?12:0)),r.type=`lowpass`,r.frequency.setValueAtTime(2600,i),r.frequency.exponentialRampToValueAtTime(600,i+a*1.5),z(s,i,.005,.22,a*1.4),n.connect(r).connect(s).connect(t),n.start(i),n.stop(i+a*1.6)}}var Me=(e,t,n)=>`M${e-n} ${t} a${n} ${n} 0 1 0 ${n*2} 0 a${n} ${n} 0 1 0 ${-n*2} 0 Z`,Ne={swordsman:[{d:`M35 5 L43 5 L43 13 L19 37 L11 29 Z`,fill:`#e9eef5`,stroke:`#5b6470`,w:1.5},{d:`M37 9 L21 25`,stroke:`#b9c3cf`,w:1.5},{d:`M7 25 L23 41 L20 44 L4 28 Z`,fill:`#f2b233`,stroke:`#7a5410`,w:1.2},{d:`M10 36 L13 39 L7 45 L4 42 Z`,fill:`#7b4a26`},{d:Me(4.5,44,2.6),fill:`#f2b233`}],archers:[{d:`M15 4 Q44 24 15 44`,stroke:`#8b5a2b`,w:4.5},{d:`M15 4 L15 44`,stroke:`#f1e7d0`,w:1.4},{d:`M6 24 L40 24`,stroke:`#d9c8a6`,w:2.4},{d:`M40 24 L33 19 L35 24 L33 29 Z`,fill:`#cfd6de`},{d:`M6 24 L2 20 L9 24 L2 28 Z`,fill:`#5fbf7a`}],musketeer:[{d:`M6 38 L36 8 L40 12 L10 42 Z`,fill:`#3a3f47`},{d:`M4 40 L14 30 L22 38 L12 46 Z`,fill:`#8b5a2b`,stroke:`#4e2f12`,w:1},{d:`M34 6 L42 6 L42 10 L38 14 Z`,fill:`#c9ced6`},{d:`M24 20 C20 10 28 4 36 6 C30 8 28 14 30 20 Z`,fill:`#d65d9a`},{d:Me(18,30,2.5),fill:`#f2b233`}],golem:[{d:`M10 42 L5 26 L13 10 L29 5 L42 15 L43 33 L33 43 Z`,fill:`#8d9098`,stroke:`#4a4d54`,w:2},{d:`M14 14 L22 22 L18 32 M30 9 L28 18 L36 24 M24 34 L32 38`,stroke:`#5b5f67`,w:1.6},{d:Me(18,22,3),fill:`#7df9ff`},{d:Me(31,22,3),fill:`#7df9ff`},{d:`M16 32 Q24 36 33 31`,stroke:`#3e4147`,w:2}],raider:[{d:`M13 44 L15 29 C12 22 15 13 23 9 L27 3 L31 9 C38 11 43 17 43 24 L37 27 L30 23 L28 31 L31 44 Z`,fill:`#8a5530`,stroke:`#4a2a12`,w:1.5},{d:`M23 9 C19 15 17 22 18 30 L15 29 C12 22 15 13 23 9 Z`,fill:`#3b2412`},{d:Me(31,15,2),fill:`#fff`},{d:`M20 34 L30 34 L30 38 L20 38 Z`,fill:`#c8c8c8`}],imps:[{d:`M17 6 L20 13 L14 12 Z M31 6 L28 13 L34 12 Z`,fill:`#e9e2c0`},{d:Me(24,16,8),fill:`#62b84a`,stroke:`#2f5e22`,w:1.5},{d:Me(12,33,8),fill:`#62b84a`,stroke:`#2f5e22`,w:1.5},{d:Me(36,33,8),fill:`#62b84a`,stroke:`#2f5e22`,w:1.5},{d:`${Me(21,15,1.6)} ${Me(27,15,1.6)} ${Me(9,32,1.6)} ${Me(15,32,1.6)} ${Me(33,32,1.6)} ${Me(39,32,1.6)}`,fill:`#ffef7a`}],firemage:[{d:`M24 3 C31 13 39 18 37 30 C36 39 31 45 24 45 C16 45 11 39 11 31 C11 24 16 20 17 13 C21 17 22 21 24 24 C26 17 26 10 24 3 Z`,fill:`#ff6a2a`,stroke:`#9c2b0a`,w:1.5},{d:`M24 22 C28 28 32 31 31 36 C30 41 27 43 24 43 C20 43 17 40 17 36 C17 31 21 30 22 25 C23 28 24 29 24 22 Z`,fill:`#ffd36b`}],dragon:[{d:`M6 30 C9 17 21 9 33 11 L44 6 L40 15 C44 19 44 25 40 29 L30 30 L26 37 L17 35 Z`,fill:`#2fae9f`,stroke:`#145a52`,w:1.5},{d:`M16 22 C10 12 4 12 2 14 C6 16 8 22 8 28 Z`,fill:`#1f7f75`},{d:Me(33,18,2.2),fill:`#ffe066`},{d:`M40 27 L46 30 L41 32 Z`,fill:`#ff8a2a`}],bats:[{d:`M24 18 C22 14 20 14 19 16 C16 11 9 11 3 15 C8 18 10 22 10 27 C13 24 16 24 18 28 C20 26 22 26 24 31 C26 26 28 26 30 28 C32 24 35 24 38 27 C38 22 40 18 45 15 C39 11 32 11 29 16 C28 14 26 14 24 18 Z`,fill:`#6c4a99`,stroke:`#2e1b47`,w:1.4},{d:`M21 16 L20 11 L23 15 Z M27 16 L28 11 L25 15 Z`,fill:`#6c4a99`},{d:`${Me(22,20,1.2)} ${Me(26,20,1.2)}`,fill:`#ffef7a`}],cannon:[{d:`M8 23 L37 11 L41 21 L13 33 Z`,fill:`#454a52`,stroke:`#1d2025`,w:1.5},{d:`M35 10 L41 8 L45 18 L39 21 Z`,fill:`#2c3036`},{d:Me(17,34,9),fill:`#8b5a2b`,stroke:`#4a2a12`,w:2},{d:Me(17,34,3),fill:`#f2b233`}],fireball:[{d:`M4 44 L18 26 L22 30 Z M6 34 L19 24 L21 28 Z M14 46 L22 30 L26 32 Z`,fill:`#ffb347`},{d:Me(29,19,13),fill:`#ff6a2a`,stroke:`#9c2b0a`,w:1.5},{d:Me(31,17,7),fill:`#ffd36b`}],arrows:[{d:`M12 4 L12 34 M24 8 L24 38 M36 4 L36 34`,stroke:`#d9c8a6`,w:2.6},{d:`M12 44 L6 32 L18 32 Z M24 47 L18 35 L30 35 Z M36 44 L30 32 L42 32 Z`,fill:`#cfd6de`,stroke:`#5b6470`,w:1},{d:`M9 4 L12 9 L15 4 M21 8 L24 13 L27 8 M33 4 L36 9 L39 4`,stroke:`#5fbf7a`,w:2}],zap:[{d:`M29 3 L11 27 L22 27 L17 45 L38 18 L27 18 L33 3 Z`,fill:`#ffe45c`,stroke:`#2e86c9`,w:2},{d:`M27 9 L18 23 L24 23`,stroke:`#ffffff`,w:1.5}]},Pe=new Map;function Fe(e,t,n,r,i){let a=Ne[t];if(!a)return;let o=Pe.get(t);o||(o=a.map(e=>new Path2D(e.d)),Pe.set(t,o));let s=i/48;e.save(),e.translate(n-i/2,r-i/2),e.scale(s,s),e.lineCap=`round`,e.lineJoin=`round`;for(let t=0;t<a.length;t++){let n=a[t];n.fill&&(e.fillStyle=n.fill,e.fill(o[t])),n.stroke&&(e.strokeStyle=n.stroke,e.lineWidth=n.w??1,e.stroke(o[t]))}e.restore()}var Ie=1.3,Le={0:{main:`#2f6fe0`,dark:`#1d438a`,light:`#8fb6ff`},1:{main:`#d8423a`,dark:`#8a2620`,light:`#ff9d94`}},Re={};for(let e of Object.values(f))e.unit&&!Re[e.unit]&&(Re[e.unit]=e.glyph);Re.golemite=`石`;function ze(e,t,n,r,i){if(Ne[t]){Fe(e,t,n,r,i);return}let a=Re[t]??f[t]?.glyph??`?`;e.fillStyle=`#ffffff`,e.font=`900 ${Math.round(i*.55)}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(a,n,r+i*.03)}var Be=class{constructor(e){S(this,`canvas`,void 0),S(this,`kind`,`2d`),S(this,`ctx`,void 0),S(this,`scale`,20),S(this,`ox`,0),S(this,`oy`,0),S(this,`dpr`,1),S(this,`effects`,[]),S(this,`shake`,0),S(this,`bg`,null),S(this,`preview`,null),S(this,`showZone`,!1),S(this,`selectedCard`,null),S(this,`zoneKey`,``),S(this,`zoneRects`,[]),this.canvas=e,this.ctx=e.getContext(`2d`)}resize(e,n){this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvas.width=Math.round(e*this.dpr),this.canvas.height=Math.round(n*this.dpr),this.canvas.style.width=`${e}px`,this.canvas.style.height=`${n}px`,this.scale=Math.min(e/t.width,n/t.height),this.ox=(e-t.width*this.scale)/2,this.oy=(n-t.height*this.scale)/2,this.bg=null}toWorld(e,t){return[(e-this.ox)/this.scale,(t-this.oy)/this.scale]}toScreen(e,t){return[this.ox+e*this.scale,this.oy+t*this.scale]}get effectCount(){return this.effects.length}reset(){this.effects=[],this.shake=0,this.preview=null,this.showZone=!1,this.selectedCard=null,this.zoneKey=``,this.zoneRects=[]}pushEvents(e,t){for(let t of e)switch(t.type){case`deploy`:this.effects.push({kind:`ring`,x:t.x,y:t.y,r:1.2,t:0,life:.5,color:Le[t.team].light});break;case`hit`:this.effects.length<220&&this.effects.push({kind:`spark`,x:t.x,y:t.y,r:t.isTower?.7:.45,t:0,life:.18,color:`#fff3b0`}),t.isTower&&t.amount>=150&&this.effects.push({kind:`text`,x:t.x,y:t.y-1.5,r:0,t:0,life:.7,color:`#ffffff`,text:`-${Math.round(t.amount)}`});break;case`attack`:!t.ranged&&t.unit!==`king`&&t.unit!==`princess`&&this.effects.push({kind:`bolt`,x:t.x,y:t.y,x2:t.tx,y2:t.ty,r:0,t:0,life:.12,color:`#ffffff`});break;case`death`:t.kind!==`tower`&&this.effects.push({kind:`puff`,x:t.x,y:t.y,r:.9,t:0,life:.45,color:`#d9d9d9`});break;case`towerDown`:this.effects.push({kind:`boom`,x:t.x,y:t.y,r:t.isKing?4:3,t:0,life:.9,color:`#ffb347`}),this.shake=.5;break;case`strike`:this.effects.push({kind:`bolt`,x:t.x,y:t.y-6,x2:t.x,y2:t.y,r:0,t:0,life:.2,color:`#e2d6ff`}),this.effects.push({kind:`boom`,x:t.x,y:t.y,r:1.2,t:0,life:.3,color:`#c9b8ff`});break;case`spell`:{let e=t.cardId===`fireball`?`#ff7a2f`:t.cardId===`zap`?`#7fd3ff`:`#f0d070`;this.effects.push({kind:`ring`,x:t.x,y:t.y,r:t.radius,t:0,life:.45,color:e}),this.effects.push({kind:`boom`,x:t.x,y:t.y,r:t.radius*.8,t:0,life:.35,color:e});break}}}sx(e){return this.ox+e*this.scale}sy(e){return this.oy+e*this.scale}buildBackground(){let e=document.createElement(`canvas`);e.width=this.canvas.width,e.height=this.canvas.height;let n=e.getContext(`2d`);n.scale(this.dpr,this.dpr);let r=this.scale;n.fillStyle=`#1e2a1a`,n.fillRect(0,0,e.width,e.height);for(let e=0;e<t.height;e++)for(let i=0;i<t.width;i++){let a=e<t.riverTop,o=(i+e)%2==0;n.fillStyle=a?o?`#6aa84f`:`#62a047`:o?`#74b357`:`#6cab4f`,n.fillRect(this.sx(i),this.sy(e),r+.5,r+.5)}n.fillStyle=`rgba(214, 190, 130, 0.35)`;for(let e of t.bridgeXs)n.fillRect(this.sx(e-.9),this.sy(6.5),1.8*r,19*r);n.fillRect(this.sx(3.5),this.sy(6.2),11*r,.6*r),n.fillRect(this.sx(3.5),this.sy(25.2),11*r,.6*r);let i=this.sy(t.riverTop),a=(t.riverBottom-t.riverTop)*r,o=n.createLinearGradient(0,i,0,i+a);o.addColorStop(0,`#3b8fd0`),o.addColorStop(.5,`#58b2ea`),o.addColorStop(1,`#3b8fd0`),n.fillStyle=o,n.fillRect(this.sx(0),i,t.width*r,a),n.strokeStyle=`rgba(255,255,255,0.35)`,n.lineWidth=Math.max(1,r*.06);for(let e=0;e<9;e++){let t=this.sx(1+e*2);n.beginPath(),n.moveTo(t,i+a*.45),n.quadraticCurveTo(t+r*.4,i+a*.3,t+r*.8,i+a*.45),n.stroke()}for(let e of t.bridgeXs){let o=this.sx(e-t.bridgeHalfWidth),s=t.bridgeHalfWidth*2*r;n.fillStyle=`#9b6b3d`,n.fillRect(o,i-r*.25,s,a+r*.5),n.strokeStyle=`#6e4826`,n.lineWidth=Math.max(1,r*.07);for(let e=0;e<=5;e++){let t=i-r*.25+(a+r*.5)*e/5;n.beginPath(),n.moveTo(o,t),n.lineTo(o+s,t),n.stroke()}n.fillStyle=`#5a3a1d`,n.fillRect(o-r*.12,i-r*.3,r*.18,a+r*.6),n.fillRect(o+s-r*.06,i-r*.3,r*.18,a+r*.6)}return n.strokeStyle=`rgba(0,0,0,0.35)`,n.lineWidth=2,n.strokeRect(this.sx(0),this.sy(0),t.width*r,t.height*r),e}render(e,t,n,r=0){let i=this.ctx;this.bg||(this.bg=this.buildBackground()),i.setTransform(1,0,0,1,0,0),i.clearRect(0,0,this.canvas.width,this.canvas.height);let a=0,o=0;if(this.shake>0){this.shake=Math.max(0,this.shake-n);let e=this.shake*this.scale*.5;a=(Math.random()-.5)*e,o=(Math.random()-.5)*e}i.drawImage(this.bg,a*this.dpr,o*this.dpr),i.setTransform(this.dpr,0,0,this.dpr,a*this.dpr,o*this.dpr);let s=this.preview?.cardId??this.selectedCard;this.showZone&&s&&this.drawZone(e,r,s);let c=e=>[e.px+(e.x-e.px)*t,e.py+(e.y-e.py)*t],l=e.entities.filter(e=>e.kind===`tower`);for(let e of l)this.drawTower(e);let u=e.entities.filter(e=>e.kind!==`tower`&&!e.stats.flying&&e.alive).sort((e,t)=>e.y-t.y);for(let e of u)this.drawUnit(e,...c(e));for(let t of e.projectiles)this.drawProjectile(t.x,t.y,t.tx,t.ty,t.source,t.team);let d=e.entities.filter(e=>e.stats.flying&&e.alive).sort((e,t)=>e.y-t.y);for(let e of d)this.drawUnit(e,...c(e));for(let t of e.spells)this.drawIncomingSpell(t.fromX,t.fromY,t.x,t.y,1-t.delay/Math.max(1e-4,t.totalDelay),t.cardId);for(let e of l)e.alive&&this.drawBar(e.x,e.y-e.half-.55,e.hp/e.maxHp,e.team,e.half*1.6,Math.ceil(e.hp));this.drawEffects(n),this.preview&&this.drawPreview(this.preview)}drawZone(e,n,r){let i=f[r];if(!i||i.kind===`spell`)return;let a=e.entities.filter(e=>e.alive&&(e.kind===`tower`||e.kind===`building`)).map(e=>e.id),o=`${n}|${i.kind}|${i.unit??``}|${a.join(`,`)}`;if(o!==this.zoneKey){this.zoneKey=o,this.zoneRects=[];let a=i.kind===`building`?`knight`:r;for(let r=.5;r<t.height;r+=1){let i=-1;for(let o=.5;o<=t.width+.5;o+=1){let s=o<t.width&&!e.canDeployAt(n,a,o,r);s&&i<0&&(i=o),(!s||o>=t.width)&&i>=0&&(this.zoneRects.push([i-.5,r-.5,o-i,1]),i=-1)}}}let s=this.ctx,c=this.scale;s.fillStyle=`rgba(220, 40, 40, 0.26)`;for(let[e,t,n,r]of this.zoneRects)s.fillRect(this.sx(e),this.sy(t),n*c,r*c+.5)}drawTower(e){let t=this.ctx,n=this.scale,r=Le[e.team],i=e.half*n,a=this.sx(e.x),o=this.sy(e.y);if(!e.alive){t.fillStyle=`#6b6258`,t.beginPath(),t.ellipse(a,o+i*.2,i*.9,i*.6,0,0,Math.PI*2),t.fill(),t.fillStyle=`#8b8177`;for(let r=0;r<5;r++){let s=r/5*Math.PI*2+e.id;t.fillRect(a+Math.cos(s)*i*.45-n*.2,o+Math.sin(s)*i*.3-n*.15,n*.4,n*.3)}return}t.fillStyle=`rgba(0,0,0,0.25)`,t.beginPath(),t.ellipse(a,o+i*.35,i*1.05,i*.65,0,0,Math.PI*2),t.fill(),t.fillStyle=`#b9b2a6`,t.strokeStyle=`#5f5a52`,t.lineWidth=Math.max(1,n*.08),t.beginPath(),t.roundRect(a-i,o-i*.85,i*2,i*1.9,i*.25),t.fill(),t.stroke(),t.fillStyle=`#d3cdc2`;let s=e.unit===`king`?5:4;for(let e=0;e<s;e++){let n=i*2/(s*2-1);t.fillRect(a-i+e*n*2,o-i*1.05,n,i*.3)}t.fillStyle=r.main,t.beginPath(),t.roundRect(a-i*.65,o-i*.55,i*1.3,i*1.2,i*.2),t.fill(),t.fillStyle=`#fff`,t.font=`bold ${Math.round(i*(e.unit===`king`?.75:.7))}px system-ui, sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(e.unit===`king`?`♛`:`◆`,a,o+i*.05),e.unit===`king`&&!e.active&&(t.fillStyle=`rgba(0,0,0,0.35)`,t.beginPath(),t.roundRect(a-i*.65,o-i*.55,i*1.3,i*1.2,i*.2),t.fill(),t.fillStyle=`#fff`,t.font=`bold ${Math.round(i*.35)}px system-ui, sans-serif`,t.fillText(`z z`,a+i*.45,o-i*.75))}drawBar(e,t,n,r,i,a){let o=this.ctx,s=this.scale,c=i*s,l=a===void 0?Math.max(3,s*.18):Math.max(11,s*.5),u=this.sx(e)-c/2,d=this.sy(t)-l/2;o.fillStyle=`rgba(0,0,0,0.6)`,o.fillRect(u-1,d-1,c+2,l+2),o.fillStyle=r===0?`#4fa3ff`:`#ff5b4f`,o.fillRect(u,d,c*Math.max(0,Math.min(1,n)),l),a!==void 0&&(o.fillStyle=`#fff`,o.font=`800 ${Math.round(l*.88)}px system-ui, sans-serif`,o.textAlign=`center`,o.textBaseline=`middle`,o.fillText(String(a),u+c/2,d+l/2+.5))}drawUnit(e,t,n){let r=this.ctx,i=this.scale,a=Le[e.team],o=(e.kind===`building`?e.half:e.stats.radius*Ie)*i,s=this.sx(t),c=e.stats.flying?i*.7:0,l=this.sy(n)-c;r.fillStyle=`rgba(0,0,0,0.28)`,r.beginPath(),r.ellipse(s,this.sy(n)+o*.55,o*.9,o*.4,0,0,Math.PI*2),r.fill();let u=e.deployTimer>0;u&&(r.globalAlpha=.65),e.kind===`building`?(r.fillStyle=`#7a7f88`,r.strokeStyle=a.dark,r.lineWidth=Math.max(1.5,i*.12),r.beginPath(),r.roundRect(s-o,l-o,o*2,o*2,o*.3),r.fill(),r.stroke(),r.fillStyle=a.main,r.fillRect(s-o,l+o*.55,o*2,o*.45),ze(r,e.unit,s,l-o*.1,o*1.9)):(e.stats.flying&&(r.fillStyle=a.dark,r.beginPath(),r.moveTo(s-o*1.8,l-o*.1),r.quadraticCurveTo(s-o,l-o*1.2,s,l-o*.3),r.quadraticCurveTo(s+o,l-o*1.2,s+o*1.8,l-o*.1),r.quadraticCurveTo(s+o,l+o*.3,s,l+o*.2),r.quadraticCurveTo(s-o,l+o*.3,s-o*1.8,l-o*.1),r.fill()),r.fillStyle=a.main,r.strokeStyle=e.stunTimer>0?`#9ee6ff`:a.light,r.lineWidth=Math.max(1.5,i*.09),r.beginPath(),r.arc(s,l,o,0,Math.PI*2),r.fill(),r.stroke(),ze(r,e.unit,s,l,o*1.75)),r.globalAlpha=1,u&&(r.strokeStyle=`rgba(255,255,255,0.9)`,r.lineWidth=Math.max(1.5,i*.1),r.beginPath(),r.arc(s,l,o+i*.2,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-e.deployTimer)),r.stroke()),e.stunTimer>0&&(r.fillStyle=`#9ee6ff`,r.font=`bold ${Math.max(9,Math.round(i*.6))}px system-ui, sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.fillText(`⚡`,s,l-o-i*.45)),e.hp<e.maxHp&&this.drawBar(t,n-(o+c)/i-.3,e.hp/e.maxHp,e.team,Math.max(1,e.stats.radius*2.2))}drawProjectile(e,t,n,r,i,a){let o=this.ctx,s=this.scale,c=this.sx(e),l=this.sy(t);if(i===`wizard`||i===`baby_dragon`||i===`fire_spirit`){o.fillStyle=`#ff8a2a`,o.beginPath(),o.arc(c,l,s*.3,0,Math.PI*2),o.fill(),o.fillStyle=`#ffe08a`,o.beginPath(),o.arc(c,l,s*.15,0,Math.PI*2),o.fill();return}let u=Math.atan2(r-t,n-e);o.strokeStyle=i===`king`||i===`princess`?a===0?`#cfe3ff`:`#ffd6d2`:`#f5e6c8`,o.lineWidth=Math.max(1.5,s*.1),o.beginPath(),o.moveTo(c-Math.cos(u)*s*.4,l-Math.sin(u)*s*.4),o.lineTo(c+Math.cos(u)*s*.2,l+Math.sin(u)*s*.2),o.stroke()}drawIncomingSpell(e,t,n,r,i,a){let o=this.ctx,s=this.scale,c=Math.max(0,Math.min(1,i)),l=e+(n-e)*c,u=t+(r-t)*c-Math.sin(c*Math.PI)*3;o.fillStyle=a===`fireball`?`#ff7a2f`:`#f0d070`,o.beginPath(),o.arc(this.sx(l),this.sy(u),s*(a===`fireball`?.55:.35),0,Math.PI*2),o.fill(),o.strokeStyle=`rgba(255,255,255,0.5)`,o.setLineDash([4,4]),o.beginPath(),o.arc(this.sx(n),this.sy(r),s*f[a].spell.radius,0,Math.PI*2),o.stroke(),o.setLineDash([])}drawEffects(e){let t=this.ctx,n=this.scale;for(let r of this.effects){r.t+=e;let i=Math.min(1,r.t/r.life),a=this.sx(r.x),o=this.sy(r.y);switch(t.globalAlpha=1-i,r.kind){case`ring`:t.strokeStyle=r.color,t.lineWidth=Math.max(2,n*.15),t.beginPath(),t.arc(a,o,r.r*n*(.4+.6*i),0,Math.PI*2),t.stroke();break;case`spark`:t.fillStyle=r.color,t.beginPath(),t.arc(a,o,r.r*n*(1-i*.5),0,Math.PI*2),t.fill();break;case`puff`:t.fillStyle=r.color;for(let e=0;e<4;e++){let s=e/4*Math.PI*2;t.beginPath(),t.arc(a+Math.cos(s)*r.r*n*i,o+Math.sin(s)*r.r*n*i,n*.3*(1-i),0,Math.PI*2),t.fill()}break;case`boom`:t.fillStyle=r.color,t.beginPath(),t.arc(a,o,r.r*n*(.3+.7*i),0,Math.PI*2),t.fill();break;case`bolt`:t.strokeStyle=r.color,t.lineWidth=Math.max(2,n*.12),t.beginPath(),t.moveTo(a,o),t.lineTo(this.sx(r.x2),this.sy(r.y2)),t.stroke();break;case`text`:t.fillStyle=r.color,t.font=`bold ${Math.round(n*.7)}px system-ui, sans-serif`,t.textAlign=`center`,t.fillText(r.text??``,a,o-i*n)}}t.globalAlpha=1,this.effects=this.effects.filter(e=>e.t<e.life)}drawPreview(e){let t=this.ctx,n=this.scale,r=f[e.cardId],i=r.unit?d[r.unit].stats:void 0,a=this.sx(e.x),o=this.sy(e.y),s=(r.kind===`spell`?r.spell.radius:Math.max(.6,(i.half??i.radius)*((r.count??1)>1?2:1.3)))*n;t.fillStyle=e.legal?`rgba(255,255,255,0.25)`:`rgba(255,60,60,0.3)`,t.strokeStyle=e.legal?`#ffffff`:`#ff4040`,t.lineWidth=2,t.beginPath(),t.arc(a,o,s,0,Math.PI*2),t.fill(),t.stroke(),e.legal?(t.globalAlpha=.85,ze(t,r.unit??e.cardId,a,o,n*1.6),t.globalAlpha=1):(t.fillStyle=`#ffdddd`,t.font=`bold ${Math.round(n*.9)}px system-ui, sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(`✕`,a,o))}},Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe=`attached`,Ze=1e3,Qe=1001,$e=1002,et=1003,tt=1004,nt=1005,rt=1006,it=1007,at=1008,ot=1009,st=1010,ct=1011,lt=1012,ut=1013,dt=1014,ft=1015,pt=1016,mt=1017,ht=1018,gt=1020,_t=35902,vt=35899,yt=1021,bt=1022,xt=1023,St=1026,Ct=1027,wt=1028,Tt=1029,Et=1030,Dt=1031,Ot=1033,kt=33776,At=33777,jt=33778,Mt=33779,Nt=35840,Pt=35841,Ft=35842,It=35843,Lt=36196,Rt=37492,zt=37496,Bt=37488,Vt=37489,Ht=37490,Ut=37491,Wt=37808,Gt=37809,Kt=37810,qt=37811,Jt=37812,Yt=37813,Xt=37814,Zt=37815,Qt=37816,$t=37817,en=37818,tn=37819,nn=37820,rn=37821,an=36492,on=36494,sn=36495,cn=36283,ln=36284,un=36285,dn=36286,fn=2300,pn=2301,mn=2302,hn=2303,gn=2400,_n=2401,vn=2402,yn=3200,bn=`srgb`,xn=`srgb-linear`,Sn=`linear`,Cn=`srgb`,wn=7680,Tn=35044,En=2e3;function Dn(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function On(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function kn(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function An(){let e=kn(`canvas`);return e.style.display=`block`,e}var jn={};function Mn(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Nn(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=Nn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=Nn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Pn(...e){let t=e.join(` `);t in jn||(jn[t]=!0,H(...e))}function Fn(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var In={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Ln=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Rn=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),zn=Math.PI/180,Bn=180/Math.PI;function Vn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Rn[e&255]+Rn[e>>8&255]+Rn[e>>16&255]+Rn[e>>24&255]+`-`+Rn[t&255]+Rn[t>>8&255]+`-`+Rn[t>>16&15|64]+Rn[t>>24&255]+`-`+Rn[n&63|128]+Rn[n>>8&255]+`-`+Rn[n>>16&255]+Rn[n>>24&255]+Rn[r&255]+Rn[r>>8&255]+Rn[r>>16&255]+Rn[r>>24&255]).toLowerCase()}function Hn(e,t,n){return Math.max(t,Math.min(n,e))}function Un(e,t){return(e%t+t)%t}function Wn(e,t,n){return(1-n)*e+n*t}function Gn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Kn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}qe=Symbol.iterator;var W=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Hn(this.x,e.x,t.x),this.y=Hn(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Hn(this.x,e,t),this.y=Hn(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Hn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Hn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[qe](){yield this.x,yield this.y}};Ve=W,Ve.prototype.isVector2=!0;var qn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Hn(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};Je=Symbol.iterator;var G=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Yn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Yn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Hn(this.x,e.x,t.x),this.y=Hn(this.y,e.y,t.y),this.z=Hn(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Hn(this.x,e,t),this.y=Hn(this.y,e,t),this.z=Hn(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Hn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Jn.copy(this).projectOnVector(e),this.sub(Jn)}reflect(e){return this.sub(Jn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Hn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Je](){yield this.x,yield this.y,yield this.z}};He=G,He.prototype.isVector3=!0;var Jn=new G,Yn=new qn,K=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Pn(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Xn.makeScale(e,t)),this}rotate(e){return Pn(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Xn.makeRotation(-e)),this}translate(e,t){return Pn(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Xn.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ue=K,Ue.prototype.isMatrix3=!0;var Xn=new K,Zn=new K().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qn=new K().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $n(){let e={enabled:!0,workingColorSpace:xn,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=tr(e.r),e.g=tr(e.g),e.b=tr(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=nr(e.r),e.g=nr(e.g),e.b=nr(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Sn:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Pn(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Pn(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[xn]:{primaries:t,whitePoint:r,transfer:Sn,toXYZ:Zn,fromXYZ:Qn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:t,whitePoint:r,transfer:Cn,toXYZ:Zn,fromXYZ:Qn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}}),e}var er=$n();function tr(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function nr(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var rr,ir=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{rr===void 0&&(rr=kn(`canvas`)),rr.width=e.width,rr.height=e.height;let t=rr.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=rr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=kn(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=tr(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(tr(t[e]/255)*255):t[e]=tr(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},ar=0,or=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ar++}),this.uuid=Vn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(sr(r[t].image)):e.push(sr(r[t]))}else e=sr(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function sr(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?ir.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var cr=0,lr=new G,ur=class e extends Ln{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=Qe,i=Qe,a=rt,o=at,s=xt,c=ot,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cr++}),this.uuid=Vn(),this.name=``,this.source=new or(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new K,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(lr).x}get height(){return this.source.getSize(lr).y}get depth(){return this.source.getSize(lr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ze:e.x-=Math.floor(e.x);break;case Qe:e.x=e.x<0?0:1;break;case $e:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Ze:e.y-=Math.floor(e.y);break;case Qe:e.y=e.y<0?0:1;break;case $e:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ur.DEFAULT_IMAGE=null,ur.DEFAULT_MAPPING=300,ur.DEFAULT_ANISOTROPY=1,Ye=Symbol.iterator;var dr=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Hn(this.x,e.x,t.x),this.y=Hn(this.y,e.y,t.y),this.z=Hn(this.z,e.z,t.z),this.w=Hn(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Hn(this.x,e,t),this.y=Hn(this.y,e,t),this.z=Hn(this.z,e,t),this.w=Hn(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Hn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Ye](){yield this.x,yield this.y,yield this.z,yield this.w}};We=dr,We.prototype.isVector4=!0;var fr=class extends Ln{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dr(0,0,e,t),this.scissorTest=!1,this.viewport=new dr(0,0,e,t),this.textures=[];let r=new ur({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:rt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new or(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},pr=class extends fr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},mr=class extends ur{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=et,this.minFilter=et,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},hr=class extends ur{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=et,this.minFilter=et,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},gr=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/_r.setFromMatrixColumn(e,0).length(),i=1/_r.setFromMatrixColumn(e,1).length(),a=1/_r.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(yr,e,br)}lookAt(e,t,n){let r=this.elements;return Cr.subVectors(e,t),Cr.lengthSq()===0&&(Cr.z=1),Cr.normalize(),xr.crossVectors(n,Cr),xr.lengthSq()===0&&(Math.abs(n.z)===1?Cr.x+=1e-4:Cr.z+=1e-4,Cr.normalize(),xr.crossVectors(n,Cr)),xr.normalize(),Sr.crossVectors(Cr,xr),r[0]=xr.x,r[4]=Sr.x,r[8]=Cr.x,r[1]=xr.y,r[5]=Sr.y,r[9]=Cr.y,r[2]=xr.z,r[6]=Sr.z,r[10]=Cr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],N=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*ee+c*F,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*ee+f*F,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*ee+g*F,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*ee+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=_r.set(r[0],r[1],r[2]).length(),o=_r.set(r[4],r[5],r[6]).length(),s=_r.set(r[8],r[9],r[10]).length();i<0&&(a=-a),vr.copy(this);let c=1/a,l=1/o,u=1/s;return vr.elements[0]*=c,vr.elements[1]*=c,vr.elements[2]*=c,vr.elements[4]*=l,vr.elements[5]*=l,vr.elements[6]*=l,vr.elements[8]*=u,vr.elements[9]*=u,vr.elements[10]*=u,t.setFromRotationMatrix(vr),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=En,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=En,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ge=gr,Ge.prototype.isMatrix4=!0;var _r=new G,vr=new gr,yr=new G(0,0,0),br=new G(1,1,1),xr=new G,Sr=new G,Cr=new G,wr=new gr,Tr=new qn,Er=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Hn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Hn(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Hn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Hn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Hn(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Hn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return wr.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wr,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tr.setFromEuler(this),this.setFromQuaternion(Tr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Er.DEFAULT_ORDER=`XYZ`;var Dr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Or=0,kr=new G,Ar=new qn,jr=new gr,Mr=new G,Nr=new G,Pr=new G,Fr=new qn,Ir=new G(1,0,0),Lr=new G(0,1,0),Rr=new G(0,0,1),zr={type:`added`},Br={type:`removed`},Vr={type:`childadded`,child:null},Hr={type:`childremoved`,child:null},Ur=class e extends Ln{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Or++}),this.uuid=Vn(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new Er,r=new qn,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new gr},normalMatrix:{value:new K}}),this.matrix=new gr,this.matrixWorld=new gr,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ar.setFromAxisAngle(e,t),this.quaternion.multiply(Ar),this}rotateOnWorldAxis(e,t){return Ar.setFromAxisAngle(e,t),this.quaternion.premultiply(Ar),this}rotateX(e){return this.rotateOnAxis(Ir,e)}rotateY(e){return this.rotateOnAxis(Lr,e)}rotateZ(e){return this.rotateOnAxis(Rr,e)}translateOnAxis(e,t){return kr.copy(e).applyQuaternion(this.quaternion),this.position.add(kr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ir,e)}translateY(e){return this.translateOnAxis(Lr,e)}translateZ(e){return this.translateOnAxis(Rr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jr.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mr.copy(e):Mr.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jr.lookAt(Nr,Mr,this.up):jr.lookAt(Mr,Nr,this.up),this.quaternion.setFromRotationMatrix(jr),r&&(jr.extractRotation(r.matrixWorld),Ar.setFromRotationMatrix(jr),this.quaternion.premultiply(Ar.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zr),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Br),Hr.child=e,this.dispatchEvent(Hr),Hr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jr.multiply(e.parent.matrixWorld)),e.applyMatrix4(jr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zr),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,e,Pr),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,Fr,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Ur.DEFAULT_UP=new G(0,1,0),Ur.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ur.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wr=class extends Ur{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Gr={type:`move`},Kr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gr)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Wr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},qr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jr={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function Xr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,er.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=er.workingColorSpace){return this.r=e,this.g=t,this.b=n,er.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=er.workingColorSpace){if(e=Un(e,1),t=Hn(t,0,1),n=Hn(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Xr(i,r,e+1/3),this.g=Xr(i,r,e),this.b=Xr(i,r,e-1/3)}return er.colorSpaceToWorking(this,r),this}setStyle(e,t=bn){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bn){let n=qr[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}copyLinearToSRGB(e){return this.r=nr(e.r),this.g=nr(e.g),this.b=nr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bn){return er.workingToColorSpace(Zr.copy(this),e),Math.round(Hn(Zr.r*255,0,255))*65536+Math.round(Hn(Zr.g*255,0,255))*256+Math.round(Hn(Zr.b*255,0,255))}getHexString(e=bn){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=er.workingColorSpace){er.workingToColorSpace(Zr.copy(this),t);let n=Zr.r,r=Zr.g,i=Zr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=er.workingColorSpace){return er.workingToColorSpace(Zr.copy(this),t),e.r=Zr.r,e.g=Zr.g,e.b=Zr.b,e}getStyle(e=bn){er.workingToColorSpace(Zr.copy(this),e);let t=Zr.r,n=Zr.g,r=Zr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Jr),this.setHSL(Jr.h+e,Jr.s+t,Jr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jr),e.getHSL(Yr);let n=Wn(Jr.h,Yr.h,t),r=Wn(Jr.s,Yr.s,t),i=Wn(Jr.l,Yr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Zr=new q;q.NAMES=qr;var Qr=class extends Ur{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Er,this.environmentIntensity=1,this.environmentRotation=new Er,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},$r=new G,ei=new G,ti=new G,ni=new G,ri=new G,ii=new G,ai=new G,oi=new G,si=new G,ci=new G,li=new dr,ui=new dr,di=new dr,fi=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),$r.subVectors(e,t),r.cross($r);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){$r.subVectors(r,t),ei.subVectors(n,t),ti.subVectors(e,t);let a=$r.dot($r),o=$r.dot(ei),s=$r.dot(ti),c=ei.dot(ei),l=ei.dot(ti),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ni)!==null&&ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,ni)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,ni.x),s.addScaledVector(a,ni.y),s.addScaledVector(o,ni.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return li.setScalar(0),ui.setScalar(0),di.setScalar(0),li.fromBufferAttribute(e,t),ui.fromBufferAttribute(e,n),di.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(li,i.x),a.addScaledVector(ui,i.y),a.addScaledVector(di,i.z),a}static isFrontFacing(e,t,n,r){return $r.subVectors(n,t),ei.subVectors(e,t),$r.cross(ei).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $r.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),$r.cross(ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;ri.subVectors(r,n),ii.subVectors(i,n),oi.subVectors(e,n);let s=ri.dot(oi),c=ii.dot(oi);if(s<=0&&c<=0)return t.copy(n);si.subVectors(e,r);let l=ri.dot(si),u=ii.dot(si);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(ri,a);ci.subVectors(e,i);let f=ri.dot(ci),p=ii.dot(ci);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ii,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ai.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ai,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(ri,a).addScaledVector(ii,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},pi=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(hi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(hi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=hi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,hi):hi.fromBufferAttribute(r,t),hi.applyMatrix4(e.matrixWorld),this.expandByPoint(hi);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),gi.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),gi.copy(e.boundingBox)),gi.applyMatrix4(e.matrixWorld),this.union(gi)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hi),hi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ci),wi.subVectors(this.max,Ci),_i.subVectors(e.a,Ci),vi.subVectors(e.b,Ci),yi.subVectors(e.c,Ci),bi.subVectors(vi,_i),xi.subVectors(yi,vi),Si.subVectors(_i,yi);let t=[0,-bi.z,bi.y,0,-xi.z,xi.y,0,-Si.z,Si.y,bi.z,0,-bi.x,xi.z,0,-xi.x,Si.z,0,-Si.x,-bi.y,bi.x,0,-xi.y,xi.x,0,-Si.y,Si.x,0];return!Di(t,_i,vi,yi,wi)||(t=[1,0,0,0,1,0,0,0,1],!Di(t,_i,vi,yi,wi))?!1:(Ti.crossVectors(bi,xi),t=[Ti.x,Ti.y,Ti.z],Di(t,_i,vi,yi,wi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},mi=[new G,new G,new G,new G,new G,new G,new G,new G],hi=new G,gi=new pi,_i=new G,vi=new G,yi=new G,bi=new G,xi=new G,Si=new G,Ci=new G,wi=new G,Ti=new G,Ei=new G;function Di(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Ei.fromArray(e,a);let o=i.x*Math.abs(Ei.x)+i.y*Math.abs(Ei.y)+i.z*Math.abs(Ei.z),s=t.dot(Ei),c=n.dot(Ei),l=r.dot(Ei);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Oi=new G,ki=new W,Ai=0,ji=class extends Ln{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ai++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Tn,this.updateRanges=[],this.gpuType=ft,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ki.fromBufferAttribute(this,t),ki.applyMatrix3(e),this.setXY(t,ki.x,ki.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Oi.fromBufferAttribute(this,t),Oi.applyMatrix3(e),this.setXYZ(t,Oi.x,Oi.y,Oi.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Oi.fromBufferAttribute(this,t),Oi.applyMatrix4(e),this.setXYZ(t,Oi.x,Oi.y,Oi.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Oi.fromBufferAttribute(this,t),Oi.applyNormalMatrix(e),this.setXYZ(t,Oi.x,Oi.y,Oi.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Oi.fromBufferAttribute(this,t),Oi.transformDirection(e),this.setXYZ(t,Oi.x,Oi.y,Oi.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Kn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Gn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Kn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Gn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Kn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Gn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Kn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Gn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Kn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Kn(t,this.array),n=Kn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Kn(t,this.array),n=Kn(n,this.array),r=Kn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Kn(t,this.array),n=Kn(n,this.array),r=Kn(r,this.array),i=Kn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Mi=class extends ji{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Ni=class extends ji{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Pi=class extends ji{constructor(e,t,n){super(new Float32Array(e),t,n)}},Fi=new pi,Ii=new G,Li=new G,Ri=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Fi.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ii.subVectors(e,this.center);let t=Ii.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Ii,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Li.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ii.copy(e.center).add(Li)),this.expandByPoint(Ii.copy(e.center).sub(Li))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},zi=0,Bi=new gr,Vi=new Ur,Hi=new G,Ui=new pi,Wi=new pi,Gi=new G,Ki=class e extends Ln{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zi++}),this.uuid=Vn(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Dn(e)?Ni:Mi)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new K().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Bi.makeRotationFromQuaternion(e),this.applyMatrix4(Bi),this}rotateX(e){return Bi.makeRotationX(e),this.applyMatrix4(Bi),this}rotateY(e){return Bi.makeRotationY(e),this.applyMatrix4(Bi),this}rotateZ(e){return Bi.makeRotationZ(e),this.applyMatrix4(Bi),this}translate(e,t,n){return Bi.makeTranslation(e,t,n),this.applyMatrix4(Bi),this}scale(e,t,n){return Bi.makeScale(e,t,n),this.applyMatrix4(Bi),this}lookAt(e){return Vi.lookAt(e),Vi.updateMatrix(),this.applyMatrix4(Vi.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Pi(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ui.setFromBufferAttribute(n),this.morphTargetsRelative?(Gi.addVectors(this.boundingBox.min,Ui.min),this.boundingBox.expandByPoint(Gi),Gi.addVectors(this.boundingBox.max,Ui.max),this.boundingBox.expandByPoint(Gi)):(this.boundingBox.expandByPoint(Ui.min),this.boundingBox.expandByPoint(Ui.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ri);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);else if(e){let n=this.boundingSphere.center;if(Ui.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Wi.setFromBufferAttribute(n),this.morphTargetsRelative?(Gi.addVectors(Ui.min,Wi.min),Ui.expandByPoint(Gi),Gi.addVectors(Ui.max,Wi.max),Ui.expandByPoint(Gi)):(Ui.expandByPoint(Wi.min),Ui.expandByPoint(Wi.max))}Ui.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Gi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Gi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Gi.fromBufferAttribute(a,t),o&&(Hi.fromBufferAttribute(e,t),Gi.add(Hi)),r=Math.max(r,n.distanceToSquared(Gi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ji(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new W,f=new W,p=new W,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ji(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gi.fromBufferAttribute(e,t),Gi.normalize(),e.setXYZ(t,Gi.x,Gi.y,Gi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ji(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},qi=new G,Ji=new G,Yi=new K,Xi=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=qi.subVectors(n,t).cross(Ji.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(qi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Yi.getNormalMatrix(e),r=this.coplanarPoint(qi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Zi=0,Qi=class extends Ln{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zi++}),this.uuid=Vn(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wn,this.stencilZFail=wn,this.stencilZPass=wn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Xi().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new W().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},$i=new G,ea=new G,ta=new G,na=new G,ra=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($i.copy(this.origin).addScaledVector(this.direction,t),$i.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ea.copy(e).add(t).multiplyScalar(.5),ta.copy(t).sub(e).normalize(),na.copy(this.origin).sub(ea);let i=e.distanceTo(t)*.5,a=-this.direction.dot(ta),o=na.dot(this.direction),s=-na.dot(ta),c=na.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ea).addScaledVector(ta,d),f}intersectSphere(e,t){if(e.radius<0)return null;$i.subVectors(e.center,this.origin);let n=$i.dot(this.direction),r=$i.dot($i)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,$i)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let N=S/w,P=C/w,F=1/w,te=T-N*D,ne=E-P*D,re=O-N*A,ie=k-P*A,I=j-N*M,ae=ee-P*M,oe=I*ie-ae*re,se=te*ae-ne*I,ce=re*ne-ie*te;if(r){if(oe<0||se<0||ce<0)return null}else if((oe<0||se<0||ce<0)&&(oe>0||se>0||ce>0))return null;let le=oe+se+ce;if(le===0)return null;let ue=F*(oe*D+se*A+ce*M);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ia=class extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Er,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},aa=new gr,oa=new ra,sa=new Ri,ca=new G,la=new G,ua=new G,da=new G,fa=new G,pa=new G,ma=new G,ha=new G,J=class extends Ur{constructor(e=new Ki,t=new ia){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){pa.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(fa.fromBufferAttribute(s,e),a?pa.addScaledVector(fa,r):pa.addScaledVector(fa.sub(t),r))}t.add(pa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(i),oa.copy(e.ray).recast(e.near),!(sa.containsPoint(oa.origin)===!1&&(oa.intersectSphere(sa,ca)===null||oa.origin.distanceToSquared(ca)>(e.far-e.near)**2))&&(aa.copy(i).invert(),oa.copy(e.ray).applyMatrix4(aa),(n.boundingBox===null||oa.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,oa)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=_a(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=_a(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=_a(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=_a(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ga(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ha.copy(s),ha.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ha);return l<n.near||l>n.far?null:{distance:l,point:ha.clone(),object:e}}function _a(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,la),e.getVertexPosition(c,ua),e.getVertexPosition(l,da);let u=ga(e,t,n,r,la,ua,da,ma);if(u){let e=new G;fi.getBarycoord(ma,la,ua,da,e),i&&(u.uv=fi.getInterpolatedAttribute(i,s,c,l,e,new W)),a&&(u.uv1=fi.getInterpolatedAttribute(a,s,c,l,e,new W)),o&&(u.normal=fi.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};fi.getNormal(la,ua,da,t.normal),u.face=t,u.barycoord=e}return u}var va=new dr,ya=new dr,ba=new dr,xa=new dr,Sa=new gr,Ca=new G,wa=new Ri,Ta=new gr,Ea=new ra,Da=class extends J{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=Xe,this.bindMatrix=new gr,this.bindMatrixInverse=new gr,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new pi),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Ca),this.boundingBox.expandByPoint(Ca)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ri),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Ca),this.boundingSphere.expandByPoint(Ca)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wa.copy(this.boundingSphere),wa.applyMatrix4(r),e.ray.intersectsSphere(wa)!==!1&&(Ta.copy(r).invert(),Ea.copy(e.ray).applyMatrix4(Ta),(this.boundingBox===null||Ea.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,Ea)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new dr,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():H(`SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;ya.fromBufferAttribute(r.attributes.skinIndex,e),ba.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(va.copy(t),t.set(0,0,0,0)):(va.set(...t,1),t.set(0,0,0)),va.applyMatrix4(this.bindMatrix);for(let e=0;e<4;e++){let r=ba.getComponent(e);if(r!==0){let i=ya.getComponent(e);Sa.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(xa.copy(va).applyMatrix4(Sa),r)}}return t.isVector4&&(t.w=va.w),t.applyMatrix4(this.bindMatrixInverse)}},Oa=class extends Ur{constructor(){super(),this.isBone=!0,this.type=`Bone`}},ka=class extends ur{constructor(e=null,t=1,n=1,r,i,a,o,s,c=et,l=et,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Aa=new gr,ja=new gr,Ma=class e{constructor(e=[],t=[]){this.uuid=Vn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){H(`Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new gr)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new gr;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:ja;Aa.multiplyMatrices(i,t[r]),Aa.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ka(t,e,e,xt,ft);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(H(`Skeleton: No bone found with UUID:`,r),i=new Oa),this.bones.push(i),this.boneInverses.push(new gr().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Na=class extends ji{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Pa=new gr,Fa=new gr,Ia=[],La=new pi,Ra=new gr,za=new J,Ba=new Ri,Va=class extends J{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Na(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Ra)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pa),La.copy(e.boundingBox).applyMatrix4(Pa),this.boundingBox.union(La)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ri),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pa),Ba.copy(e.boundingSphere).applyMatrix4(Pa),this.boundingSphere.union(Ba)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(za.geometry=this.geometry,za.material=this.material,za.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ba.copy(this.boundingSphere),Ba.applyMatrix4(n),e.ray.intersectsSphere(Ba)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Pa),Fa.multiplyMatrices(n,Pa),za.matrixWorld=Fa,za.raycast(e,Ia);for(let e=0,n=Ia.length;e<n;e++){let n=Ia[e];n.instanceId=i,n.object=this,t.push(n)}Ia.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Na(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new ka(new Float32Array(r*this.count),r,this.count,wt,ft));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ha=new Ri,Ua=new W(.5,.5),Wa=new G,Ga=class{constructor(e=new Xi,t=new Xi,n=new Xi,r=new Xi,i=new Xi,a=new Xi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ha.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ha.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ha)}intersectsSprite(e){return Ha.center.set(0,0,0),Ha.radius=.7071067811865476+Ua.distanceTo(e.center),Ha.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ha)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Wa.x=r.normal.x>0?e.max.x:e.min.x,Wa.y=r.normal.y>0?e.max.y:e.min.y,Wa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Wa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ka=class extends Qi{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},qa=new gr,Ja=new ra,Ya=new Ri,Xa=new G,Za=class extends Ur{constructor(e=new Ki,t=new Ka){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ya.copy(n.boundingSphere),Ya.applyMatrix4(r),Ya.radius+=i,e.ray.intersectsSphere(Ya)===!1)return;qa.copy(r).invert(),Ja.copy(e.ray).applyMatrix4(qa);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Xa.fromBufferAttribute(l,n),Qa(Xa,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Xa.fromBufferAttribute(l,a),Qa(Xa,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Qa(e,t,n,r,i,a,o){let s=Ja.distanceSqToPoint(e);if(s<n){let n=new G;Ja.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var $a=class extends ur{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},eo=class extends ur{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},to=class extends ur{constructor(e,t,n=dt,r,i,a,o=et,s=et,c,l=St,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new or(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},no=class extends to{constructor(e,t=dt,n=301,r,i,a=et,o=et,s,c=St){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ro=class extends ur{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},io=class e extends Ki{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Pi(c,3)),this.setAttribute(`normal`,new Pi(l,3)),this.setAttribute(`uv`,new Pi(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ao=class e extends Ki{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new G,g=new G;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new Pi(o,3)),this.setAttribute(`normal`,new Pi(s,3)),this.setAttribute(`uv`,new Pi(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},oo=class e extends Ki{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new G,l=new W;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Pi(a,3)),this.setAttribute(`normal`,new Pi(o,3)),this.setAttribute(`uv`,new Pi(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},so=class e extends Ki{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Pi(u,3)),this.setAttribute(`normal`,new Pi(d,3)),this.setAttribute(`uv`,new Pi(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new W,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},co=class e extends so{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},lo=class e extends Ki{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Pi(i,3)),this.setAttribute(`normal`,new Pi(i.slice(),3)),this.setAttribute(`uv`,new Pi(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new G,r=new G,i=new G;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new G;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new G;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new G,t=new G,n=new G,r=new G,o=new W,s=new W,c=new W;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},uo=class e extends lo{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},fo=class e extends lo{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},po=class e extends Ki{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=Hn(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new G,d=new W,f=new G,p=new G,m=new G,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Pi(a,3)),this.setAttribute(`uv`,new Pi(o,2)),this.setAttribute(`normal`,new Pi(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},mo=class e extends Ki{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Pi(p,3)),this.setAttribute(`normal`,new Pi(m,3)),this.setAttribute(`uv`,new Pi(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ho=class e extends Ki{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new G,p=new W;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Pi(s,3)),this.setAttribute(`normal`,new Pi(c,3)),this.setAttribute(`uv`,new Pi(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},go=class e extends Ki{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Pi(p,3)),this.setAttribute(`normal`,new Pi(m,3)),this.setAttribute(`uv`,new Pi(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},_o=class e extends Ki{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new G,f=new G,p=new G;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Pi(c,3)),this.setAttribute(`normal`,new Pi(l,3)),this.setAttribute(`uv`,new Pi(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function vo(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(bo(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(bo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function yo(e){let t={};for(let n=0;n<e.length;n++){let r=vo(e[n]);for(let e in r)t[e]=r[e]}return t}function bo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function xo(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function So(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:er.workingColorSpace}var Co={clone:vo,merge:yo},wo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,To=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Eo=class extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wo,this.fragmentShader=To,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=vo(e.uniforms),this.uniformsGroups=xo(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new dr().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new gr().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Do=class extends Eo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Oo=class extends Qi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Er,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ko=class extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=yn,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ao=class extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function jo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Mo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var No=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Po=class extends No{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gn,endingEnd:gn}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case _n:i=e,o=2*t-n;break;case vn:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case _n:a=e,s=2*n-t;break;case vn:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Fo=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Io=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Lo=class extends No{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Bo(n,t,g,y,r);i[p]=Ro(x,o,_,b,m)}return i}};function Ro(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function zo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Bo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ro(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=zo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Vo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=jo(t,this.TimeBufferType),this.values=jo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:jo(e.times,Array),values:jo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Mo(e.settings)&&(n.settings={inTangents:jo(e.settings.inTangents,Array),outTangents:jo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Io(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Po(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Lo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case fn:t=this.InterpolantFactoryMethodDiscrete;break;case pn:t=this.InterpolantFactoryMethodLinear;break;case mn:t=this.InterpolantFactoryMethodSmooth;break;case hn:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return fn;case this.InterpolantFactoryMethodLinear:return pn;case this.InterpolantFactoryMethodSmooth:return mn;case this.InterpolantFactoryMethodBezier:return hn}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Mo(this.settings)&&(Ho(this.settings.inTangents,e),Ho(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&On(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===mn,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Mo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ho(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Vo.prototype.ValueTypeName=``,Vo.prototype.TimeBufferType=Float32Array,Vo.prototype.ValueBufferType=Float32Array,Vo.prototype.DefaultInterpolation=pn;var Uo=class extends Vo{constructor(e,t,n){super(e,t,n)}};Uo.prototype.ValueTypeName=`bool`,Uo.prototype.ValueBufferType=Array,Uo.prototype.DefaultInterpolation=fn,Uo.prototype.InterpolantFactoryMethodLinear=void 0,Uo.prototype.InterpolantFactoryMethodSmooth=void 0;var Wo=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Wo.prototype.ValueTypeName=`color`;var Go=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Go.prototype.ValueTypeName=`number`;var Ko=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)qn.slerpFlat(i,0,a,c-o,a,c,s);return i}},qo=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ko(this.times,this.values,this.getValueSize(),e)}};qo.prototype.ValueTypeName=`quaternion`,qo.prototype.InterpolantFactoryMethodSmooth=void 0;var Jo=class extends Vo{constructor(e,t,n){super(e,t,n)}};Jo.prototype.ValueTypeName=`string`,Jo.prototype.ValueBufferType=Array,Jo.prototype.DefaultInterpolation=fn,Jo.prototype.InterpolantFactoryMethodLinear=void 0,Jo.prototype.InterpolantFactoryMethodSmooth=void 0;var Yo=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Yo.prototype.ValueTypeName=`vector`;var Xo=class extends Ur{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Zo=class extends Xo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Ur.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Qo=new gr,$o=new G,es=new G,ts=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.mapType=ot,this.map=null,this.mapPass=null,this.matrix=new gr,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ga,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new dr(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;$o.setFromMatrixPosition(e.matrixWorld),t.position.copy($o),es.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(es),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Qo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Qo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Qo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ns=new G,rs=new qn,is=new G,as=class extends Ur{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new gr,this.projectionMatrix=new gr,this.projectionMatrixInverse=new gr,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ns,rs,is),is.x===1&&is.y===1&&is.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ns,rs,is.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ns,rs,is),is.x===1&&is.y===1&&is.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ns,rs,is.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},os=new G,ss=new W,cs=new W,ls=class extends as{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Bn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(zn*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bn*2*Math.atan(Math.tan(zn*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){os.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(os.x,os.y).multiplyScalar(-e/os.z),os.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(os.x,os.y).multiplyScalar(-e/os.z)}getViewSize(e,t){return this.getViewBounds(e,ss,cs),t.subVectors(cs,ss)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(zn*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},us=class extends as{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ds=class extends ts{constructor(){super(new us(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},fs=class extends Xo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Ur.DEFAULT_UP),this.updateMatrix(),this.target=new Ur,this.shadow=new ds}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ps=class extends Xo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},ms=-90,hs=1,gs=class extends Ur{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ls(ms,hs,e,t);r.layers=this.layers,this.add(r);let i=new ls(ms,hs,e,t);i.layers=this.layers,this.add(i);let a=new ls(ms,hs,e,t);a.layers=this.layers,this.add(a);let o=new ls(ms,hs,e,t);o.layers=this.layers,this.add(o);let s=new ls(ms,hs,e,t);s.layers=this.layers,this.add(s);let c=new ls(ms,hs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},_s=class extends ls{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},vs=`\\[\\]\\.:\\/`,ys=RegExp(`[\\[\\]\\.:\\/]`,`g`),bs=`[^\\[\\]\\.:\\/]`,xs=`[^`+vs.replace(`\\.`,``)+`]`,Ss=`((?:WC+[\\/:])*)`.replace(`WC`,bs),Cs=`(WCOD+)?`.replace(`WCOD`,xs),ws=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,bs),Ts=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,bs),Es=RegExp(`^`+Ss+Cs+ws+Ts+`$`),Ds=[`material`,`materials`,`bones`,`map`],Os=class{constructor(e,t,n){let r=n||ks.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ks=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ys,``)}static parseTrackName(e){let t=Es.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ds.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ks.Composite=Os,ks.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ks.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ks.prototype.GetterByBindingType=[ks.prototype._getValue_direct,ks.prototype._getValue_array,ks.prototype._getValue_arrayElement,ks.prototype._getValue_toArray],ks.prototype.SetterByBindingTypeAndVersioning=[[ks.prototype._setValue_direct,ks.prototype._setValue_direct_setNeedsUpdate,ks.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_array,ks.prototype._setValue_array_setNeedsUpdate,ks.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_arrayElement,ks.prototype._setValue_arrayElement_setNeedsUpdate,ks.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_fromArray,ks.prototype._setValue_fromArray_setNeedsUpdate,ks.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],Ke=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},Ke.prototype.isMatrix2=!0;function As(e,t,n,r){let i=js(r);switch(n){case yt:return e*t;case wt:return e*t/i.components*i.byteLength;case Tt:return e*t/i.components*i.byteLength;case Et:return e*t*2/i.components*i.byteLength;case Dt:return e*t*2/i.components*i.byteLength;case bt:return e*t*3/i.components*i.byteLength;case xt:return e*t*4/i.components*i.byteLength;case Ot:return e*t*4/i.components*i.byteLength;case kt:case At:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case jt:case Mt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Pt:case It:return Math.max(e,16)*Math.max(t,8)/4;case Nt:case Ft:return Math.max(e,8)*Math.max(t,8)/2;case Lt:case Rt:case Bt:case Vt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case zt:case Ht:case Ut:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Wt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Gt:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Kt:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case qt:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Jt:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Yt:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Xt:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Zt:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Qt:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case $t:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case en:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case tn:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case nn:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case rn:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case an:case on:case sn:return Math.ceil(e/4)*Math.ceil(t/4)*16;case cn:case ln:return Math.ceil(e/4)*Math.ceil(t/4)*8;case un:case dn:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function js(e){switch(e){case ot:case st:return{byteLength:1,components:1};case lt:case ct:case pt:return{byteLength:2,components:1};case mt:case ht:return{byteLength:2,components:4};case dt:case ut:case ft:return{byteLength:4,components:1};case _t:case vt:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ms(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ns(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Y={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},X={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new K}},envmap:{envMap:{value:null},envMapRotation:{value:new K},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new K}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new K}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new K},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new K},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new K},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new K}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new K}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new K}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0},uvTransform:{value:new K}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}}},Ps={basic:{uniforms:yo([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.fog]),vertexShader:Y.meshbasic_vert,fragmentShader:Y.meshbasic_frag},lambert:{uniforms:yo([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Y.meshlambert_vert,fragmentShader:Y.meshlambert_frag},phong:{uniforms:yo([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Y.meshphong_vert,fragmentShader:Y.meshphong_frag},standard:{uniforms:yo([X.common,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.roughnessmap,X.metalnessmap,X.fog,X.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag},toon:{uniforms:yo([X.common,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.gradientmap,X.fog,X.lights,{emissive:{value:new q(0)}}]),vertexShader:Y.meshtoon_vert,fragmentShader:Y.meshtoon_frag},matcap:{uniforms:yo([X.common,X.bumpmap,X.normalmap,X.displacementmap,X.fog,{matcap:{value:null}}]),vertexShader:Y.meshmatcap_vert,fragmentShader:Y.meshmatcap_frag},points:{uniforms:yo([X.points,X.fog]),vertexShader:Y.points_vert,fragmentShader:Y.points_frag},dashed:{uniforms:yo([X.common,X.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Y.linedashed_vert,fragmentShader:Y.linedashed_frag},depth:{uniforms:yo([X.common,X.displacementmap]),vertexShader:Y.depth_vert,fragmentShader:Y.depth_frag},normal:{uniforms:yo([X.common,X.bumpmap,X.normalmap,X.displacementmap,{opacity:{value:1}}]),vertexShader:Y.meshnormal_vert,fragmentShader:Y.meshnormal_frag},sprite:{uniforms:yo([X.sprite,X.fog]),vertexShader:Y.sprite_vert,fragmentShader:Y.sprite_frag},background:{uniforms:{uvTransform:{value:new K},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Y.background_vert,fragmentShader:Y.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new K}},vertexShader:Y.backgroundCube_vert,fragmentShader:Y.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Y.cube_vert,fragmentShader:Y.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Y.equirect_vert,fragmentShader:Y.equirect_frag},distance:{uniforms:yo([X.common,X.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Y.distance_vert,fragmentShader:Y.distance_frag},shadow:{uniforms:yo([X.lights,X.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Y.shadow_vert,fragmentShader:Y.shadow_frag}};Ps.physical={uniforms:yo([Ps.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new K},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new K},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new K},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new K},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new K},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new K},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new K},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new K},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new K},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new K},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new K},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new K}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag};var Fs={r:0,b:0,g:0},Is=new gr,Ls=new K;Ls.set(-1,0,0,0,1,0,0,0,1);function Rs(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new J(new io(1,1,1),new Eo({name:`BackgroundCubeMaterial`,uniforms:vo(Ps.backgroundCube.uniforms),vertexShader:Ps.backgroundCube.vertexShader,fragmentShader:Ps.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Is.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ls),l.material.toneMapped=er.getTransfer(i.colorSpace)!==Cn,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new J(new mo(2,2),new Eo({name:`BackgroundMaterial`,uniforms:vo(Ps.background.uniforms),vertexShader:Ps.background.vertexShader,fragmentShader:Ps.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=er.getTransfer(i.colorSpace)!==Cn,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Fs,So(e)),n.buffers.color.setClear(Fs.r,Fs.g,Fs.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function zs(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Bs(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Vs(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Hs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Xi,s=new K,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Us=4,Ws=6,Gs=20,Ks=256,qs=new us,Js=new q,Ys=null,Xs=0,Zs=0,Qs=!1,$s=new G,ec=new G,tc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=$s}=i;Ys=this._renderer.getRenderTarget(),Xs=this._renderer.getActiveCubeFace(),Zs=this._renderer.getActiveMipmapLevel(),Qs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ys,Xs,Zs),this._renderer.xr.enabled=Qs,e.scissorTest=!1,ic(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ys=this._renderer.getRenderTarget(),Xs=this._renderer.getActiveCubeFace(),Zs=this._renderer.getActiveMipmapLevel(),Qs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:rt,minFilter:rt,generateMipmaps:!1,type:pt,format:xt,colorSpace:xn,depthBuffer:!1},r=rc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=nc(r)),this._blurMaterial=oc(r,e,t),this._ggxMaterial=ac(r,e,t)}return r}_compileMaterial(e){let t=new J(new Ki,e);this._renderer.compile(t,qs)}_sceneToCubeUV(e,t,n,r,i){let a=new ls(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Js),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new J(new io,new ia({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Js),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;ic(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;ic(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,qs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Us?n-d+Us:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,ic(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,qs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,ic(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,qs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];ic(t,3*l*(r>this._lodMax-Us?r-this._lodMax+Us:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,qs)}};function nc(e){let t=[],n=[],r=e,i=e-Us+1+Ws;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?ec.set(1,r,n):e===1?ec.set(-n,1,-r):e===2?ec.set(-n,r,1):e===3?ec.set(-1,r,-n):e===4?ec.set(-n,-1,r):ec.set(n,r,-1),ec.toArray(l,(e*6+t)*3)}}let u=new Ki;u.setAttribute(`position`,new ji(c,3)),u.setAttribute(`outputDirection`,new ji(l,3)),n.push(new J(u,null)),r>Us&&r--}return{lodMeshes:n,sizeLods:t}}function rc(e,t,n){let r=new pr(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function ic(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ac(e,t,n){return new Eo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ks,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:lc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function oc(e,t,n){return new Eo({name:`SphericalGaussianBlur`,defines:{SAMPLES:Gs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:lc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function sc(){return new Eo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function cc(){return new Eo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function lc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var uc=class extends pr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new $a(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new io(5,5,5),i=new Eo({name:`CubemapFromEquirect`,uniforms:vo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new J(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=rt),new gs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function dc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new uc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new tc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new tc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function fc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Pn(`WebGLRenderer: `+e+` extension not supported.`),t}}}function pc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Ni:Mi)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function mc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function hc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function gc(e,t,n){let r=new WeakMap,i=new dr;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new mr(h,p,m,u);g.type=ft,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new W(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function _c(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var vc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function yc(e,t,n,r,i,a){let o=new pr(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Ki;l.setAttribute(`position`,new Pi([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Pi([0,2,0,0,2,0],2));let u=new Do({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new J(l,u),f=new us(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new pr(t,n,{type:pt,depthBuffer:!1,stencilBuffer:!1}),c=new pr(t,n,{type:pt,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},er.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=vc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var bc=new ur,xc=new to(1,1),Sc=new mr,Cc=new hr,wc=new $a,Tc=[],Ec=[],Dc=new Float32Array(16),Oc=new Float32Array(9),kc=new Float32Array(4);function Ac(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Tc[i];if(a===void 0&&(a=new Float32Array(i),Tc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function jc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Mc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Nc(e,t){let n=Ec[t];n===void 0&&(n=new Int32Array(t),Ec[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Pc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(jc(n,t))return;e.uniform2fv(this.addr,t),Mc(n,t)}}function Ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(jc(n,t))return;e.uniform3fv(this.addr,t),Mc(n,t)}}function Lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(jc(n,t))return;e.uniform4fv(this.addr,t),Mc(n,t)}}function Rc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(jc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Mc(n,t)}else{if(jc(n,r))return;kc.set(r),e.uniformMatrix2fv(this.addr,!1,kc),Mc(n,r)}}function zc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(jc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Mc(n,t)}else{if(jc(n,r))return;Oc.set(r),e.uniformMatrix3fv(this.addr,!1,Oc),Mc(n,r)}}function Bc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(jc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Mc(n,t)}else{if(jc(n,r))return;Dc.set(r),e.uniformMatrix4fv(this.addr,!1,Dc),Mc(n,r)}}function Vc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(jc(n,t))return;e.uniform2iv(this.addr,t),Mc(n,t)}}function Uc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(jc(n,t))return;e.uniform3iv(this.addr,t),Mc(n,t)}}function Wc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(jc(n,t))return;e.uniform4iv(this.addr,t),Mc(n,t)}}function Gc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Kc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(jc(n,t))return;e.uniform2uiv(this.addr,t),Mc(n,t)}}function qc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(jc(n,t))return;e.uniform3uiv(this.addr,t),Mc(n,t)}}function Jc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(jc(n,t))return;e.uniform4uiv(this.addr,t),Mc(n,t)}}function Yc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(xc.compareFunction=n.isReversedDepthBuffer()?518:515,a=xc):a=bc,n.setTexture2D(t||a,i)}function Xc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Cc,i)}function Zc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||wc,i)}function Qc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Sc,i)}function $c(e){switch(e){case 5126:return Pc;case 35664:return Fc;case 35665:return Ic;case 35666:return Lc;case 35674:return Rc;case 35675:return zc;case 35676:return Bc;case 5124:case 35670:return Vc;case 35667:case 35671:return Hc;case 35668:case 35672:return Uc;case 35669:case 35673:return Wc;case 5125:return Gc;case 36294:return Kc;case 36295:return qc;case 36296:return Jc;case 35678:case 36198:case 36298:case 36306:case 35682:return Yc;case 35679:case 36299:case 36307:return Xc;case 35680:case 36300:case 36308:case 36293:return Zc;case 36289:case 36303:case 36311:case 36292:return Qc}}function el(e,t){e.uniform1fv(this.addr,t)}function tl(e,t){let n=Ac(t,this.size,2);e.uniform2fv(this.addr,n)}function nl(e,t){let n=Ac(t,this.size,3);e.uniform3fv(this.addr,n)}function rl(e,t){let n=Ac(t,this.size,4);e.uniform4fv(this.addr,n)}function il(e,t){let n=Ac(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function al(e,t){let n=Ac(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ol(e,t){let n=Ac(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function sl(e,t){e.uniform1iv(this.addr,t)}function cl(e,t){e.uniform2iv(this.addr,t)}function ll(e,t){e.uniform3iv(this.addr,t)}function ul(e,t){e.uniform4iv(this.addr,t)}function dl(e,t){e.uniform1uiv(this.addr,t)}function fl(e,t){e.uniform2uiv(this.addr,t)}function pl(e,t){e.uniform3uiv(this.addr,t)}function ml(e,t){e.uniform4uiv(this.addr,t)}function hl(e,t,n){let r=this.cache,i=t.length,a=Nc(n,i);jc(r,a)||(e.uniform1iv(this.addr,a),Mc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?xc:bc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function gl(e,t,n){let r=this.cache,i=t.length,a=Nc(n,i);jc(r,a)||(e.uniform1iv(this.addr,a),Mc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Cc,a[e])}function _l(e,t,n){let r=this.cache,i=t.length,a=Nc(n,i);jc(r,a)||(e.uniform1iv(this.addr,a),Mc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||wc,a[e])}function vl(e,t,n){let r=this.cache,i=t.length,a=Nc(n,i);jc(r,a)||(e.uniform1iv(this.addr,a),Mc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Sc,a[e])}function yl(e){switch(e){case 5126:return el;case 35664:return tl;case 35665:return nl;case 35666:return rl;case 35674:return il;case 35675:return al;case 35676:return ol;case 5124:case 35670:return sl;case 35667:case 35671:return cl;case 35668:case 35672:return ll;case 35669:case 35673:return ul;case 5125:return dl;case 36294:return fl;case 36295:return pl;case 36296:return ml;case 35678:case 36198:case 36298:case 36306:case 35682:return hl;case 35679:case 36299:case 36307:return gl;case 35680:case 36300:case 36308:case 36293:return _l;case 36289:case 36303:case 36311:case 36292:return vl}}var bl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=$c(t.type)}},xl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=yl(t.type)}},Sl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Cl=/(\w+)(\])?(\[|\.)?/g;function wl(e,t){e.seq.push(t),e.map[t.id]=t}function Tl(e,t,n){let r=e.name,i=r.length;for(Cl.lastIndex=0;;){let a=Cl.exec(r),o=Cl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){wl(n,l===void 0?new bl(s,e,t):new xl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Sl(s),wl(n,e)),n=e}}}var El=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Tl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Dl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Ol=37297,kl=0;function Al(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var jl=new K;function Ml(e){er._getMatrix(jl,er.workingColorSpace,e);let t=`mat3( ${jl.elements.map(e=>e.toFixed(4))} )`;switch(er.getTransfer(e)){case Sn:return[t,`LinearTransferOETF`];case Cn:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Nl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Al(e.getShaderSource(t),r)}return i}function Pl(e,t){let n=Ml(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Fl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Il(e,t){let n=Fl[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ll=new G;function Rl(){return er.getLuminanceCoefficients(Ll),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ll.x.toFixed(4)}, ${Ll.y.toFixed(4)}, ${Ll.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function zl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Hl).join(`
`)}function Bl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Vl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Hl(e){return e!==``}function Ul(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Wl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Gl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Kl(e){return e.replace(Gl,Jl)}var ql=new Map;function Jl(e,t){let n=Y[t];if(n===void 0){let e=ql.get(t);if(e!==void 0)n=Y[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Kl(n)}var Yl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xl(e){return e.replace(Yl,Zl)}function Zl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Ql(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var $l={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function eu(e){return $l[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var tu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function nu(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:tu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var ru={302:`ENVMAP_MODE_REFRACTION`};function iu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:ru[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var au={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ou(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:au[e.combine]||`ENVMAP_BLENDING_NONE`}function su(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function cu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=eu(n),l=nu(n),u=iu(n),d=ou(n),f=su(n),p=zl(n),m=Bl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Hl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Hl).join(`
`),_.length>0&&(_+=`
`)):(g=[Ql(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Hl).join(`
`),_=[Ql(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Y.tonemapping_pars_fragment,n.toneMapping===0?``:Il(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Y.colorspace_pars_fragment,Pl(`linearToOutputTexel`,n.outputColorSpace),Rl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Hl).join(`
`)),o=Kl(o),o=Ul(o,n),o=Wl(o,n),s=Kl(s),s=Ul(s,n),s=Wl(s,n),o=Xl(o),s=Xl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Dl(i,i.VERTEX_SHADER,y),S=Dl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Nl(i,x,`vertex`),n=Nl(i,S,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new El(i,h),T=Vl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Ol)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=kl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var lu=0,uu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new du(e),t.set(e,n)),n}},du=class{constructor(e){this.id=lu++,this.code=e,this.usedTimes=0}};function fu(e){return e===1030||e===37490||e===36285}function pu(e,t,n,r,i,a){let o=new Dr,s=new uu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Ps[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,N=h.isBatchedMesh===!0,P=!!i.map,F=!!i.matcap,te=!!x,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,I=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,se=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.dispersion>0,fe=i.retroreflectivity>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=le&&!!i.anisotropyMap,_e=ue&&!!i.clearcoatMap,ve=ue&&!!i.clearcoatNormalMap,ye=ue&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,L=pe&&!!i.iridescenceThicknessMap,xe=me&&!!i.sheenColorMap,Se=me&&!!i.sheenRoughnessMap,Ce=!!i.specularMap,R=!!i.specularColorMap,we=!!i.specularIntensityMap,z=he&&!!i.transmissionMap,B=he&&!!i.thicknessMap,Te=!!i.gradientMap,Ee=!!i.alphaMap,V=i.alphaTest>0,De=!!i.alphaHash,Oe=!!i.extensions,ke=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(ke=e.toneMapping);let Ae={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:N,batchingColor:N&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:er.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:P,matcap:F,envMap:te,envMapMode:te&&x.mapping,envMapCubeUVHeight:S,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:I,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:I&&i.normalMapType===1,normalMapTangentSpace:I&&i.normalMapType===0,packedNormalMap:I&&i.normalMapType===0&&fu(i.normalMap.format),metalnessMap:se,roughnessMap:ce,anisotropy:le,anisotropyMap:ge,clearcoat:ue,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:de,retroreflection:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:L,sheen:me,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:R,specularIntensityMap:we,transmission:he,transmissionMap:z,thicknessMap:B,gradientMap:Te,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ee,alphaTest:V,alphaHash:De,combine:i.combine,mapUv:P&&m(i.map.channel),aoMapUv:ne&&m(i.aoMap.channel),lightMapUv:re&&m(i.lightMap.channel),bumpMapUv:ie&&m(i.bumpMap.channel),normalMapUv:I&&m(i.normalMap.channel),displacementMapUv:ae&&m(i.displacementMap.channel),emissiveMapUv:oe&&m(i.emissiveMap.channel),metalnessMapUv:se&&m(i.metalnessMap.channel),roughnessMapUv:ce&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:L&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(i.sheenRoughnessMap.channel),specularMapUv:Ce&&m(i.specularMap.channel),specularColorMapUv:R&&m(i.specularColorMap.channel),specularIntensityMapUv:we&&m(i.specularIntensityMap.channel),transmissionMapUv:z&&m(i.transmissionMap.channel),thicknessMapUv:B&&m(i.thicknessMap.channel),alphaMapUv:Ee&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(I||le),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(P||Ee),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&I===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:ke,decodeVideoTexture:P&&i.map.isVideoTexture===!0&&er.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&er.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Oe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Oe&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ae.vertexUv1s=c.has(1),Ae.vertexUv2s=c.has(2),Ae.vertexUv3s=c.has(3),c.clear(),Ae}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Ps[t];n=Co.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new cu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function mu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function hu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function gu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function _u(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||hu),r.length>1&&r.sort(t||gu),i.length>1&&i.sort(t||gu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function vu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new _u,e.set(t,[i])):n>=r.length?(i=new _u,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function yu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new G,color:new q};break;case`SpotLight`:n={position:new G,direction:new G,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function bu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var xu=0;function Su(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Cu(e){let t=new yu,n=bu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new gr,o=new gr;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Su);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=X.LTC_FLOAT_1,r.rectAreaLTC2=X.LTC_FLOAT_2):(r.rectAreaLTC1=X.LTC_HALF_1,r.rectAreaLTC2=X.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=xu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function wu(e){let t=new Cu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Tu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new wu(e),t.set(n,[a])):r>=i.length?(a=new wu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Eu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Du=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ou=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],ku=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Au=new gr,ju=new G,Mu=new G;function Nu(e,t,n){let r=new Ga,i=new W,a=new W,o=new dr,s=new ko,c=new Ao,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Eo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:Eu,fragmentShader:Du}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Ki;m.setAttribute(`position`,new ji(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new J(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new pr(i.x,i.y,{format:Et,type:pt,minFilter:rt,magFilter:rt,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new to(i.x,i.y,ft),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=St,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=et,d.map.depthTexture.magFilter=et}else l.isPointLight?(d.map=new uc(i.x),d.map.depthTexture=new no(i.x,dt)):(d.map=new pr(i.x,i.y),d.map.depthTexture=new to(i.x,i.y,dt)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=St,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=rt,d.map.depthTexture.magFilter=rt):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=et,d.map.depthTexture.magFilter=et);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),ju.setFromMatrixPosition(l.matrixWorld),e.position.copy(ju),Mu.copy(e.position),Mu.add(Ou[t]),e.up.copy(ku[t]),e.lookAt(Mu),e.updateMatrixWorld(),n.makeTranslation(-ju.x,-ju.y,-ju.z),Au.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Au,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new pr(i.x,i.y,{format:Et,type:pt}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Pu(e,t){function n(){let t=!1,n=new dr,r=null,i=new dr(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?se(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=In[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?se(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,N=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),M=N>=2):(N=parseFloat(/^WebGL (\d)/.exec(P)[1]),M=N>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new dr().fromArray(ne),I=new dr().fromArray(re);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),se(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),se(e.CULL_FACE),me(0);function se(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(se(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):se(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?se(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?ce(e.CULL_FACE):(se(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(M&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(se(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function be(t){t?se(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function L(t){t===void 0&&(t=e.TEXTURE0+ee-1),F!==t&&(e.activeTexture(t),F=t)}function xe(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+ee-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function Se(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function R(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function z(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function B(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ee(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function V(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ae(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function je(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function Me(t){I.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),I.copy(t))}function Ne(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Pe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),I.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:se,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:L,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:R,texImage2D:De,texImage3D:Oe,pixelStorei:Ae,getParameter:ke,updateUBOMapping:Ne,uniformBlockBinding:Pe,texStorage2D:Ee,texStorage3D:V,texSubImage2D:we,texSubImage3D:z,compressedTexSubImage2D:B,compressedTexSubImage3D:Te,scissor:je,viewport:Me,reset:Fe}}function Fu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new W,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):kn(`canvas`)}function g(e,t,n){let r=1,i=Ce(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Sn:er.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function ee(){let e=O;return e>=i.maxTextures&&H(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function N(t,i){let a=r.get(t);if(t.isVideoTexture&&xe(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ce(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function P(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ce(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function F(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ce(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function te(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?le(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ne={[Ze]:e.REPEAT,[Qe]:e.CLAMP_TO_EDGE,[$e]:e.MIRRORED_REPEAT},re={[et]:e.NEAREST,[tt]:e.NEAREST_MIPMAP_NEAREST,[nt]:e.NEAREST_MIPMAP_LINEAR,[rt]:e.LINEAR,[it]:e.LINEAR_MIPMAP_NEAREST,[at]:e.LINEAR_MIPMAP_LINEAR},ie={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function I(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ne[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ne[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ne[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,re[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,re[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ie[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ae(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=M(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function oe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function se(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=oe(n.start,r.width,4),c=oe(t.start,r.width,4);n.start<=i+1&&a===c&&oe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ce(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ae(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=er.getPrimaries(er.workingColorSpace),r=o.colorSpace===``?null:er.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Se(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);I(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Ct,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&se(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=As(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=As(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ce(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ce(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function le(t,o,s){if(o.image.length!==6)return;let c=ae(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=er.getPrimaries(er.workingColorSpace),r=o.colorSpace===``?null:er.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Se(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);I(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ce(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ue(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,be(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function de(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;L(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,be(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,be(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);L(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,be(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,be(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function fe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),I(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else N(i.depthTexture,0);let u=l.__webglTexture,d=be(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function pe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)fe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?fe(i.__webglFramebuffer[0],t,0):fe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),de(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),de(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function me(t,n,i){let a=r.get(t);n!==void 0&&ue(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&pe(t)}function he(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&L(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=be(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),de(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),I(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ue(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ue(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),I(c,a),ue(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),I(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ue(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ue(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&pe(t)}function ge(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let _e=[],ve=[];function ye(t){if(t.samples>0){if(L(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(_e.length=0,ve.length=0,_e.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(_e.push(l),ve.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ve)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,_e))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function be(e){return Math.min(i.maxSamples,e.samples)}function L(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function xe(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Se(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(er.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ce(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ee,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=N,this.setTexture2DArray=P,this.setTexture3D=F,this.setTextureCube=te,this.rebindTextures=me,this.setupRenderTarget=he,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=L,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Iu(e,t){function n(n,r=``){let i,a=er.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Lu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ru=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,zu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ro(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Eo({vertexShader:Lu,fragmentShader:Ru,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new J(new mo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bu=class extends Ln{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new zu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new W,C=null,w=null,T=new ls;T.viewport=new dr;let E=new ls;E.viewport=new dr;let D=[T,E],O=new _s,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Kr,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Kr,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Kr,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,I.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Ct:St,a=_.stencil?gt:dt);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new pr(d.textureWidth,d.textureHeight,{format:xt,type:ot,depthTexture:new to(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new pr(f.framebufferWidth,f.framebufferHeight,{format:xt,type:ot,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),I.setContext(r),I.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let N=new G,P=new G;function F(e,t,n){N.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=N.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function te(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;te(O,i);for(let e=0;e<a.length;e++)te(a[e],i);a.length===2?F(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ne(e,O,i)};function ne(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Bn*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let re=null;function ie(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new ls,o.layers.enable(n),o.viewport=new dr,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ro,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}re&&re(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let I=new Ms;I.setAnimationLoop(ie),this.setAnimationLoop=function(e){re=e},this.dispose=function(){}}},Vu=new gr,Hu=new K;Hu.set(-1,0,0,0,1,0,0,0,1);function Uu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,So(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Vu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Hu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Wu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return U(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Gu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ku=null;function qu(){return Ku===null&&(Ku=new ka(Gu,16,16,Et,pt),Ku.name=`DFG_LUT`,Ku.minFilter=rt,Ku.magFilter=rt,Ku.wrapS=Qe,Ku.wrapT=Qe,Ku.generateMipmaps=!1,Ku.needsUpdate=!0),Ku}var Ju=class{constructor(e={}){let{canvas:t=An(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ot}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([Ot,Dt,Tt]),g=new Set([ot,dt,lt,gt,mt,ht]),_=new Uint32Array(4),v=new Int32Array(4),y=new G,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=bn;let j=0,ee=0,M=null,N=-1,P=null,F=new dr,te=new dr,ne=null,re=new q(0),ie=0,I=t.width,ae=t.height,oe=1,se=null,ce=null,le=new dr(0,0,I,ae),ue=new dr(0,0,I,ae),de=!1,fe=new Ga,pe=!1,me=!1,he=new gr,ge=new G,_e=new dr,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ye=!1;function be(){return M===null?oe:1}let L=n;function xe(e,n){return t.getContext(e,n)}let Se,Ce,R,we,z,B,Te,Ee,V,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,Ue,!1),t.addEventListener(`webglcontextrestored`,We,!1),t.addEventListener(`webglcontextcreationerror`,Ge,!1),L===null){let t=`webgl2`;if(L=xe(t,e),L===null)throw xe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ve()}catch(e){throw t.removeEventListener(`webglcontextlost`,Ue,!1),t.removeEventListener(`webglcontextrestored`,We,!1),t.removeEventListener(`webglcontextcreationerror`,Ge,!1),U(`WebGLRenderer: `+e.message),e}function Ve(){Se=new fc(L),Se.init(),Re=new Iu(L,Se),Ce=new Vs(L,Se,e,Re),R=new Pu(L,Se),Ce.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),O=L.createFramebuffer(),k=L.createFramebuffer(),A=L.createFramebuffer(),we=new hc(L),z=new mu,B=new Fu(L,Se,R,z,Ce,Re,we),Te=new dc(T),Ee=new Ns(L),ze=new zs(L,Ee),V=new pc(L,Ee,we,ze),De=new _c(L,V,Ee,ze,we),Fe=new gc(L,Ce,B),Me=new Hs(z),Oe=new pu(T,Te,Se,Ce,ze,Me),ke=new Uu(T,z),Ae=new vu,je=new Tu(Se),Pe=new Rs(T,Te,R,De,p,s),Ne=new Nu(T,De,Ce),Be=new Wu(L,we,Ce,R),Ie=new Bs(L,Se,we),Le=new mc(L,Se,we),we.programs=Oe.programs,T.capabilities=Ce,T.extensions=Se,T.properties=z,T.renderLists=Ae,T.shadowMap=Ne,T.state=R,T.info=we}m!==1009&&(w=new yc(m,t.width,t.height,o,r,i));let He=new Bu(T,L);this.xr=He,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(e){e!==void 0&&(oe=e,this.setSize(I,ae,!1))},this.getSize=function(e){return e.set(I,ae)},this.setSize=function(e,n,r=!0){He.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(I=e,ae=n,t.width=Math.floor(e*oe),t.height=Math.floor(n*oe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(I*oe,ae*oe).floor()},this.setDrawingBufferSize=function(e,n,r){I=e,ae=n,oe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(le)},this.setViewport=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),R.viewport(F.copy(le).multiplyScalar(oe).round())},this.getScissor=function(e){return e.copy(ue)},this.setScissor=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),R.scissor(te.copy(ue).multiplyScalar(oe).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(e){R.setScissorTest(de=e)},this.setOpaqueSort=function(e){se=e},this.setTransparentSort=function(e){ce=e},this.getClearColor=function(e){return e.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=Pe.getClearColor(),r=Pe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,L.clearBufferiv(L.COLOR,0,v))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ue,!1),t.removeEventListener(`webglcontextrestored`,We,!1),t.removeEventListener(`webglcontextcreationerror`,Ge,!1),Pe.dispose(),Ae.dispose(),je.dispose(),z.dispose(),Te.dispose(),De.dispose(),ze.dispose(),Be.dispose(),Oe.dispose(),He.dispose(),He.removeEventListener(`sessionstart`,Qe),He.removeEventListener(`sessionend`,$e),et.stop()};function Ue(e){e.preventDefault(),Mn(`WebGLRenderer: Context Lost.`),E=!0}function We(){Mn(`WebGLRenderer: Context Restored.`),E=!1;let e=we.autoReset,t=Ne.enabled,n=Ne.autoUpdate,r=Ne.needsUpdate,i=Ne.type;Ve(),we.autoReset=e,Ne.enabled=t,Ne.autoUpdate=n,Ne.needsUpdate=r,Ne.type=i}function Ge(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ke(e){let t=e.target;t.removeEventListener(`dispose`,Ke),qe(t)}function qe(e){Je(e),z.remove(e)}function Je(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){Oe.releaseProgram(e)}),e.isShaderMaterial&&Oe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ve);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=vt(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=V.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ze.setup(i,r,s,n,c);let h,g=Ie;if(c!==null&&(h=Ee.get(c),g=Le,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*be()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*be()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(Se.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ee.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ye(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),pe===!0&&Me.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ct(e,t,r),e.side=0,e.needsUpdate=!0,ct(e,t,r),e.side=2):ct(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=je.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),me=this.localClippingEnabled,pe=Me.init(this.clippingPlanes,me),pe===!0&&Me.setGlobalState(this.clippingPlanes,t),D!==null&&Ne.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Ye(o,n,t,e),r.add(o)}else Ye(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=z.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Se.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Xe=null;function Ze(e){Xe&&Xe(e)}function Qe(){et.stop()}function $e(){et.start()}let et=new Ms;et.setAnimationLoop(Ze),typeof self<`u`&&et.setContext(self),this.setAnimationLoop=function(e){Xe=e,He.setAnimationLoop(e),e===null?et.stop():et.start()},He.addEventListener(`sessionstart`,Qe),He.addEventListener(`sessionend`,$e),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=He.enabled===!0&&He.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),He.enabled===!0&&He.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(He.cameraAutoUpdate===!0&&He.updateCamera(t),t=He.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=je.get(e,C.length),x.init(t),x.state.textureUnits=B.getTextureUnits(),C.push(x),he.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),fe.setFromProjectionMatrix(he,En,t.reversedDepth),me=this.localClippingEnabled,pe=Me.init(this.clippingPlanes,me),b=Ae.get(e,S.length),b.init(),S.push(b),He.enabled===!0&&He.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&tt(e,t,-1/0,T.sortObjects)}tt(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(se,ce),ye=He.enabled===!1||He.isPresenting===!1||He.hasDepthSensing()===!1,ye&&Pe.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),pe===!0&&Me.beginShadows();let i=x.state.shadowsArray;if(Ne.render(i,e,t),pe===!0&&Me.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];rt(n,r,e,a)}ye&&Pe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];nt(b,e,n,n.viewport)}}else r.length>0&&rt(n,r,e,t),ye&&Pe.render(e),nt(b,e,t)}M!==null&&ee===0&&(B.updateMultisampleRenderTarget(M),B.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),ze.resetDefaultState(),N=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],B.setTextureUnits(x.state.textureUnits),pe===!0&&Me.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function tt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(fe)){r&&_e.setFromMatrixPosition(e.matrixWorld).applyMatrix4(he);let i=De.update(e),a=e.material;a.visible&&b.push(e,i,a,n,_e.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(fe))){let i=De.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),_e.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),_e.copy(e.boundingSphere.center)),_e.applyMatrix4(e.matrixWorld).applyMatrix4(he)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,_e.z,s,t)}}else a.visible&&b.push(e,i,a,n,_e.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)tt(i[e],t,n,r)}function nt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),pe===!0&&Me.setGlobalState(T.clippingPlanes,n),r&&R.viewport(F.copy(r)),i.length>0&&it(i,t,n),a.length>0&&it(a,t,n),o.length>0&&it(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function rt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Se.has(`EXT_color_buffer_half_float`)||Se.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new pr(1,1,{generateMipmaps:!0,type:e?pt:ot,minFilter:at,samples:Math.max(4,Ce.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:er.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(re),ie=T.getClearAlpha(),ie<1&&T.setClearColor(16777215,.5),T.clear(),ye&&Pe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),pe===!0&&Me.setGlobalState(T.clippingPlanes,r),it(e,n,r),B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a),Se.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,st(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(re,ie),d!==void 0&&(r.viewport=d),T.toneMapping=u}function it(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&st(o,t,n,s,l,c)}}function st(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ct(e,t,n){t.isScene!==!0&&(t=ve);let r=z.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Oe.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Oe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Te.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ke),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return ft(e,s),d}else s.uniforms=Oe.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Oe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Me.uniform),ft(e,s),r.needsLights=bt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ut(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=El.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ft(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function _t(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function vt(e,t,n,r,i){t.isScene!==!0&&(t=ve),B.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:er.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Te.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),y=x.state.lights;if(pe===!0&&(me===!0||e!==P)){let t=e===P&&r.id===N;Me.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Me.numPlanes||v.numIntersection!==Me.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=ct(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(R.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==N&&(N=r.id,w=!0),v.needsLights){let e=_t(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||P!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(L,`projectionMatrix`,e.projectionMatrix),O.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(L,ge.setFromMatrixPosition(e.matrixWorld)),Ce.logarithmicDepthBuffer&&O.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(L,`sunShadowMap`,y.state.sunShadowMap,B),y.state.directionalShadowMap.length>0&&O.setValue(L,`directionalShadowMap`,y.state.directionalShadowMap,B),y.state.spotShadowMap.length>0&&O.setValue(L,`spotShadowMap`,y.state.spotShadowMap,B),y.state.pointShadowMap.length>0&&O.setValue(L,`pointShadowMap`,y.state.pointShadowMap,B)),i.isSkinnedMesh){O.setOptional(L,i,`bindMatrix`),O.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(L,`boneTexture`,e.boneTexture,B))}i.isBatchedMesh&&(O.setOptional(L,i,`batchingTexture`),O.setValue(L,`batchingTexture`,i._matricesTexture,B),O.setOptional(L,i,`batchingIdTexture`),O.setValue(L,`batchingIdTexture`,i._indirectTexture,B),O.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(L,`batchingColorTexture`,i._colorsTexture,B));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Fe.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=qu()),w){if(O.setValue(L,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&yt(k,E),a&&r.fog===!0&&ke.refreshFogUniforms(k,a),ke.refreshMaterialUniforms(k,r,oe,ae,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}El.upload(L,ut(v),k,B)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(El.upload(L,ut(v),k,B),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(L,`center`,i.center),O.setValue(L,`modelViewMatrix`,i.modelViewMatrix),O.setValue(L,`normalMatrix`,i.normalMatrix),O.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Be.update(n,S),Be.bind(n,S)}}return S}function yt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function bt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest,R.viewport(F),R.scissor(te),R.setScissorTest(ne),N=-1;return}if(o.__webglFramebuffer===void 0)B.setupRenderTarget(e);else if(o.__hasExternalTextures)B.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);B.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&B.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest}else F.copy(le).multiplyScalar(oe).floor(),te.copy(ue).multiplyScalar(oe).floor(),ne=de;if(n!==0&&(r=O),R.bindFramebuffer(L.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(F),R.scissor(te),R.setScissorTest(ne),i){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}N=-1};function xt(e){let t=z.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ce.textureFormatReadable(e.format),t.__typeReadable=Ce.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=xt(o);if(u.__formatReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,Re.convert(c),Re.convert(l),a)}finally{let e=M===null?null:z.get(M).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=xt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,Re.convert(l),Re.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=M===null?null:z.get(M).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Fn(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;B.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Re.convert(t.format),_=Re.convert(t.type),v;t.isData3DTexture?(B.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(B.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(B.setTexture2D(t,0),v=L.TEXTURE_2D),R.activeTexture(L.TEXTURE0),R.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(L.UNPACK_ROW_LENGTH),b=R.getParameter(L.UNPACK_IMAGE_HEIGHT),x=R.getParameter(L.UNPACK_SKIP_PIXELS),S=R.getParameter(L.UNPACK_SKIP_ROWS),C=R.getParameter(L.UNPACK_SKIP_IMAGES);R.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(L.UNPACK_SKIP_PIXELS,l),R.pixelStorei(L.UNPACK_SKIP_ROWS,u),R.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,o,s,f,p,o,s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,k),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,o,s,f,p,o,s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(L.UNPACK_ROW_LENGTH,y),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(L.UNPACK_SKIP_PIXELS,x),R.pixelStorei(L.UNPACK_SKIP_ROWS,S),R.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&B.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?B.setTextureCube(e,0):e.isData3DTexture?B.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?B.setTexture2DArray(e,0):B.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,R.reset(),ze.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=er._getDrawingBufferColorSpace(e),t.unpackColorSpace=er._getUnpackColorSpace()}};function Yu(){return{t:Math.random()*10,walk:Math.random()*6,moving:!1,speed:1,windup:-1,sinceHit:9,flinch:0,charging:!1,jumping:!1,frozen:!1,active:!1,aimYaw:0,wakeT:0}}var Xu=e=>e<0?0:e>1?1:e*e*(3-2*e);function Zu(e,t,n=0,r=0){e&&e.rotation.set(t,n,r)}function Qu(e){if(e.sinceHit<.3){let t=e.sinceHit/.3;return t<.25?1:1-Xu((t-.25)/.75)}return e.windup>=0?-Xu(e.windup):0}function $u(e,t,n,r){if(n.frozen)return;n.t+=r;let i=t.cadence??1;switch(n.moving&&(n.walk+=r*Math.PI*2*1.5*i*Math.max(.6,Math.min(1.8,n.speed))*(n.charging?1.6:1)),n.sinceHit+=r,n.flinch=Math.max(0,n.flinch-r*6),t.rig){case`biped`:return ed(e,t,n);case`mount`:return td(e,t,n);case`flyer`:return nd(e,t,n);case`blob`:return rd(e,n);case`blimp`:return id(e,n,r);case`cannon`:return ad(e,n);case`inferno`:return od(e,n);case`tomb`:return sd(e,n);case`princess`:return ld(e,n);case`king`:return ud(e,n);default:return}}function ed(e,t,n,r=!1){let i=e.byName,a=t.stride??1,o=n.walk,s=n.moving&&!r,c=s?Math.sin(o):0,l=Math.sin(n.t*2.2)*.04,u=i.hips;if(u&&!r){let t=e.bones.indexOf(u),r=e.rest[t].y;u.position.y=r+(s?Math.abs(Math.cos(o))*.05:0)-n.flinch*.03,u.rotation.z=s?Math.sin(o)*.05:Math.sin(n.t*.9)*.025}r||(Zu(i.legL,c*.75*a),Zu(i.legR,-c*.75*a));let d=Qu(n),f=n.windup>=0||n.sinceHit<.3,p=t.attack===`swing`||t.attack===`chop`||t.attack===`stab`||t.attack===`punch`||t.attack===`slam`||t.attack===`spin`,m=f&&p?d<0?.38*-d:-.3*d:0,h=f&&p?d<0?-.1*-d:.18*d:0;if(Zu(i.spine,(s?.12:0)+l-n.flinch*.3+h,(s?c*.08:0)+m),i.spine){let e=s?.045*(1-Math.abs(Math.cos(o)))-.015:n.flinch*.05;i.spine.scale.set(1+e*.5,1-e,1+e*.5)}Zu(i.head,-.22-l*.5+n.flinch*.2+h*.4,-m*.4,Math.sin(n.t*1.3)*.04);let g=-c*.55+.05,_=c*.55+.05,v=-.08,y=.08,b=0;switch(t.attack){case`swing`:f&&(_=d<0?-2.3*-d:-2.3+3*d,y=.25);break;case`chop`:if(f){let e=d<0?-2.7*-d:-2.7+3.1*d;_=e,g=e*.9,v=-.25,y=.25}break;case`stab`:f?_=d<0?-1+.6*-d:-1-.6*d:n.charging&&(_=-1.2);break;case`punch`:f&&(_=d<0?-1.2-1.2*-d:-2.4+1.6*d,g=-.6);break;case`slam`:if(f){let e=d<0?-2.9*-d:-2.9+3.4*d;g=e,_=e,v=-.3,y=.3}break;case`spin`:if(f){v=-1.35,y=1.35,g=0,_=0;let e=n.sinceHit<.3?1:n.windup>=0?Xu((n.windup-.4)/.6):0;i.hips&&(i.hips.rotation.y=e*Math.PI*2)}else i.hips&&(i.hips.rotation.y=0);break;case`shoot`:(f||n.windup>=0)&&(_=-1.45,g=-1.35,v=-.45,n.sinceHit<.15&&Zu(i.spine,-.15));break;case`bow`:g=f?-1.5:g,v=f?-.1:v,f&&(_=d<0?-1.4:-1.4+.5*d,b=d<0?-.6*-d:0);break;case`cast`:f&&(_=d<0?-.6-1.6*-d:-2.2+1.2*d);break;case`throw`:f&&(_=d<0?-2.8*-d:-2.8+3.4*d)}Zu(i.armL,g,0,v),Zu(i.armR,_,b,y),r&&(Zu(i.legL,-1.2,0,.2),Zu(i.legR,-1.2,0,-.2))}function td(e,t,n){let r=e.byName,i=n.walk,a=n.moving||n.jumping,o=a?.85:.05;Zu(r.legFL,Math.sin(i)*o),Zu(r.legFR,Math.sin(i+.6)*o),Zu(r.legBL,Math.sin(i+Math.PI)*o),Zu(r.legBR,Math.sin(i+Math.PI+.6)*o),n.jumping&&(Zu(r.legFL,-.9),Zu(r.legFR,-.8),Zu(r.legBL,.9),Zu(r.legBR,.8));let s=r.body;if(s){let t=e.bones.indexOf(s);s.position.y=e.rest[t].y+(a?Math.abs(Math.sin(i))*.06:Math.sin(n.t*2)*.01),s.rotation.x=a?Math.sin(i*2)*.05:0;let r=Qu(n);(n.windup>=0||n.sinceHit<.3)&&(s.rotation.x-=(r<0?-r:1-r)*.12)}Zu(r.mhead,a?Math.sin(i*2)*.1:Math.sin(n.t*1.5)*.05),Zu(r.tail,0,Math.sin(n.t*(a?9:3))*.4),ed(e,t,n,!0)}function nd(e,t,n){let r=e.byName,i=Math.sin(n.t*(t.attack===`breath`?9:14));Zu(r.wingL,0,0,-.2+i*.75),Zu(r.wingR,0,0,.2-i*.75);let a=r.body,o=Qu(n),s=n.windup>=0||n.sinceHit<.3;if(a){let r=e.bones.indexOf(a);a.position.y=e.rest[r].y+Math.sin(n.t*3)*.06,a.position.z=e.rest[r].z+(s&&t.attack===`bite`?o<0?-.15*-o:.3*(1-o):0),a.rotation.x=n.moving?.25:.05}let c=s?o<0?-.35*-o:.35*(1-o):Math.sin(n.t*1.7)*.06;Zu(r.head,c-n.flinch*.3),Zu(r.tail,0,Math.sin(n.t*4)*.35),Zu(r.armL,s?-1:-.3),Zu(r.armR,s?-1:-.3)}function rd(e,t){let n=e.byName.body;if(!n)return;let r=e.bones.indexOf(n),i=t.moving?Math.abs(Math.sin(t.walk)):Math.abs(Math.sin(t.t*3))*.3;n.position.y=e.rest[r].y+i*.22;let a=1-(1-i)*.12;n.scale.set(1/Math.sqrt(a),a,1/Math.sqrt(a))}function id(e,t,n){let r=e.byName;r.prop&&(r.prop.rotation.z+=n*18),r.body&&(r.body.rotation.z=Math.sin(t.t*1.3)*.05,r.body.rotation.x=Math.sin(t.t*.9)*.03);let i=Qu(t);r.bay&&(r.bay.rotation.x=t.windup>=0||t.sinceHit<.3?i<0?-.1*-i:.15*(1-i):0)}function ad(e,t){let n=e.byName;if(n.turret&&(n.turret.rotation.y=t.aimYaw),n.barrel){let r=e.bones.indexOf(n.barrel),i=t.sinceHit<.25?(1-t.sinceHit/.25)*.18:0;n.barrel.position.z=e.rest[r].z-i}}function od(e,t){let n=e.byName.crystal;if(!n)return;let r=e.bones.indexOf(n);n.rotation.y=t.t*(t.windup>=0||t.sinceHit<1?4:.8),n.position.y=e.rest[r].y+Math.sin(t.t*2)*.06}function sd(e,t){let n=e.byName.stone;n&&(n.rotation.z=t.flinch*.08*Math.sin(t.t*40))}function cd(e,t){let n=e.byName;n.hips&&(n.hips.rotation.y=t.aimYaw);let r=Qu(t),i=t.windup>=0||t.sinceHit<.3;Zu(n.armR,i?-1.45+(r>0?-.2*(1-r):0):.05,0,.1),Zu(n.armL,i?-1.3:-.05,0,-.3),Zu(n.spine,Math.sin(t.t*2)*.03+(t.sinceHit<.15?-.12:0)),Zu(n.head,0,0,Math.sin(t.t*1.1)*.05)}function ld(e,t){cd(e,t)}function ud(e,t){let n=e.byName,r=t.active?Xu(Math.min(1,t.wakeT/1.6)):0,i=t.aimYaw>=0?1:-1;for(let[a,o]of[[n.cannon,1],[n.cannon2,-1]]){if(!a)continue;let n=e.bones.indexOf(a),s=o===i&&t.sinceHit<.3?(1-t.sinceHit/.3)*.22:0;a.rotation.set((1-r)*.35,t.aimYaw*r,0),a.position.y=e.rest[n].y-(1-r)*.12,a.position.z=e.rest[n].z-s}n.hips&&(n.hips.rotation.y=t.aimYaw*r*.6);let a=t.active&&t.sinceHit<.45;Zu(n.head,t.active?Math.sin(t.t*1.7)*.05-.12:.35+Math.sin(t.t*1.2)*.05,0,t.active?0:.2),Zu(n.armR,t.active?a?-2.5:-.4:.1,0,a?.35:.2),Zu(n.armL,t.active?-.25:.1,0,-.3),Zu(n.spine,t.active?Math.sin(t.t*2)*.03-(a?.08:0):.25+Math.sin(t.t*1.2)*.04)}var dd=t.width/2,fd=t.height/2,pd=52*Math.PI/180,md=Math.sin(pd),hd=Math.cos(pd),gd=e=>e-dd,_d=e=>e-fd;function vd(e){return Math.atan2(Math.cos(e),Math.sin(e))}function yd(e,t,n){let r=t-e;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return e+r*n}var bd={0:{main:`#2f74e8`,light:`#8fc2ff`,dark:`#1b3f86`,bar:`#3fa2ff`},1:{main:`#de3b33`,light:`#ff9a8f`,dark:`#86221d`,bar:`#ff4d48`}};function xd(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Ki,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Sd(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Sd(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Sd(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new ji(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Cd=new q,wd=class{constructor(){S(this,`geos`,[]),S(this,`bones`,[]),S(this,`bone`,0),S(this,`shine`,0),S(this,`trackParts`,!1),S(this,`partAt`,[]),S(this,`gradient`,!0)}get parts(){return this.geos.length}addBone(e,t,n){return this.bones.push({name:e,parent:t,at:n}),this.bones.length-1}boneIndex(e){let t=this.bones.findIndex(t=>t.name===e);if(t<0)throw Error(`bone ${e}`);return t}add(e,t){this.trackParts&&this.partAt.push(t.at??[0,0,0]);let n=e.index?e:e.toNonIndexed();if(!n.index){let e=n.attributes.position.count,t=new Uint32Array(e);for(let n=0;n<e;n++)t[n]=n;n.setIndex(new ji(t,1))}for(let e of Object.keys(n.attributes))e!==`position`&&e!==`normal`&&n.deleteAttribute(e);let r=new gr().compose(new G(...t.at??[0,0,0]),new qn().setFromEuler(new Er(...t.rot??[0,0,0])),new G(...t.scale??[1,1,1]));n.applyMatrix4(r);let i=n.attributes.position.count;Cd.set(t.color);let a=new Float32Array(i*3),o=new Uint16Array(i*4),s=new Float32Array(i*4),c=t.bone??this.bone,l=new Float32Array(i).fill(t.shine??this.shine),u=n.attributes.position,d=1/0,f=-1/0;for(let e=0;e<i;e++){let t=u.getY(e);t<d&&(d=t),t>f&&(f=t)}let p=f-d,m=this.gradient&&p>.06;for(let e=0;e<i;e++){let t=1;m&&(t=.8+.26*((u.getY(e)-d)/p));let n=u.getY(e);this.gradient&&n<.12&&(t*=.86+n/.12*.14),a[e*3]=Cd.r*t,a[e*3+1]=Cd.g*t,a[e*3+2]=Cd.b*t,o[e*4]=c,s[e*4]=1}return n.setAttribute(`color`,new ji(a,3)),n.setAttribute(`shine`,new ji(l,1)),n.setAttribute(`skinIndex`,new ji(o,4)),n.setAttribute(`skinWeight`,new ji(s,4)),this.geos.push(n),this}box(e,t,n,r){return this.add(new io(e,t,n),r)}frustum(e,t,n,r,i){let a=new io(e,t,n),o=a.attributes.position;for(let e=0;e<o.count;e++)o.getY(e)>0&&o.setXYZ(e,o.getX(e)*r,o.getY(e),o.getZ(e)*r);return a.computeVertexNormals(),this.add(a,i)}blob(e,t,n,r,i=10){let a=r.scale??[1,1,1];return this.add(new go(.5,i,Math.max(6,Math.round(i*.75))),{...r,scale:[e*a[0],t*a[1],n*a[2]]})}sphere(e,t,n=12){return this.add(new go(e,n,Math.max(6,Math.round(n*.7))),t)}shell(e,t,n=Math.PI/2,r=0,i=Math.PI*2,a=14){let o=new go(e,a,Math.max(5,Math.round(a*.6)),r,i,0,n),s=o.clone();s.scale(.97,.97,.97);let c=s.index;for(let e=0;e<c.count;e+=3){let t=c.getX(e);c.setX(e,c.getX(e+2)),c.setX(e+2,t)}let l=s.attributes.normal;for(let e=0;e<l.count;e++)l.setXYZ(e,-l.getX(e),-l.getY(e),-l.getZ(e));return this.add(o,t),this.add(s,{...t,color:t.color})}capsule(e,t,n,r=8){return this.add(new ao(e,t,3,r),n)}cyl(e,t,n,r,i=10){return this.add(new so(e,t,n,i),r)}cone(e,t,n,r=10){return this.add(new co(e,t,r),n)}torus(e,t,n,r=14,i=Math.PI*2){return this.add(new _o(e,t,6,r,i),n)}rock(e,t,n=0){return this.add(new fo(e,n),t)}gem(e,t){return this.add(new uo(e,0),t)}lathe(e,t,n=12){return this.add(new po(e.map(([e,t])=>new W(e,t)),n),t)}build(e){let t=xd(this.geos,!1);if(!t)throw Error(`merge failed`);t.computeBoundingSphere();for(let e of this.geos)e.dispose();this.geos=[];let n=this.bones.length?this.bones:[{name:`root`,parent:-1,at:[0,0,0]}];return{geometry:t,bones:n,boneInverses:n.map(e=>new gr().makeTranslation(-e.at[0],-e.at[1],-e.at[2])),height:e}}};function Td(e,t){let n=e.bones.map(e=>{let t=new Oa;return t.name=e.name,t}),r=[];e.bones.forEach((t,i)=>{let a=t.parent>=0?e.bones[t.parent].at:[0,0,0];n[i].position.set(t.at[0]-a[0],t.at[1]-a[1],t.at[2]-a[2]),r.push(n[i].position.clone()),t.parent>=0&&n[t.parent].add(n[i])});let i=new Da(e.geometry,t);i.add(n[0]),i.updateMatrixWorld(!0),i.bind(new Ma(n,e.boneInverses.map(e=>e.clone()))),i.frustumCulled=!1,i.castShadow=!0;let a={};for(let e of n)a[e.name]=e;return{mesh:i,bones:n,byName:a,rest:r}}var Ed=new q(`#fff4dc`);function Dd(e={}){let{rim:t=.38,spec:n=.42,...r}=e,i=new Oo({vertexColors:!0,...r});return i.userData.rim=t,i.onBeforeCompile=e=>{e.uniforms.uRim={value:i.userData.rim},e.uniforms.uRimColor={value:Ed},e.uniforms.uSpec={value:n},i.userData.shader=e,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float shine;
varying float vShine;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vShine = shine;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uRim;
uniform vec3 uRimColor;
uniform float uSpec;
varying float vShine;`).replace(`#include <opaque_fragment>`,`vec3 nrm = normalize(normal);
        float rimF = 1.0 - clamp(dot(nrm, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
        outgoingLight += uRimColor * pow(rimF, 2.6) * uRim * (1.0 + vShine * 0.8);
        #if NUM_DIR_LIGHTS > 0
        if (vShine > 0.01) {
          // 主光源的 Blinn-Phong 高光：一小塊亮點＋較寬的柔和光暈，金屬看起來會「閃」
          vec3 hv = normalize(directionalLights[0].direction + vec3(0.0, 0.0, 1.0));
          float nh = max(dot(nrm, hv), 0.0);
          float sp = pow(nh, 48.0) + 0.1 * pow(nh, 8.0);
          outgoingLight += directionalLights[0].color * sp * vShine * uSpec;
        }
        #endif
        #include <opaque_fragment>`)},i.customProgramCacheKey=()=>`toon-rim-spec`,i}function Od(e,t,n,r,i=0){let a=t,o=t,s=t;i>0&&(a+=.32*i,o+=.02*i,s+=.08*i),n?(a+=.05,o+=.22,s+=.42):r&&(a+=.2,o+=.2,s+=.04),e.emissive.setRGB(Math.min(1,a),Math.min(1,o),Math.min(1,s))}function kd(e,t,n,r,i=[0,0,0],a=!1){let o=t.height/1.25,s=(t.build??1)*o,c=(t.headScale??1)*o,[l,u,d]=i,f=(a?.2:.3)*o*(t.legScale??1),p=u+f,m=.42*o*(t.torsoScale??1),h=p+m,g=.27*c,_=.27*s+.02,v=h-.08*o,y=e.addBone(`hips`,r,[l,p,d]),b=e.addBone(`spine`,y,[l,p+.02*o,d]),x=e.addBone(`head`,b,[l,h,d]),S=e.addBone(`armL`,b,[l+_,v,d]),C=e.addBone(`armR`,b,[l-_,v,d]),w=e.addBone(`legL`,y,[l+.11*s,p,d]),T=e.addBone(`legR`,y,[l-.11*s,p,d]),E=t.bones?.035*s:.085*s,D=.24*o,O=t.metal??0;for(let[n,r]of[[w,1],[T,-1]]){let i=l+r*.11*s;a?(e.capsule(E,f*.6,{at:[i+r*.08*s,p-f*.3,d+.06],rot:[.5,0,r*.5],color:t.legs,bone:n}),e.blob(.16*s,.12*o,.22*s,{at:[i+r*.16*s,p-f*.75,d+.12],color:t.boots,bone:n})):(e.capsule(E,f*.55,{at:[i,p-f*.45,d],color:t.legs,bone:n,shine:O*.7}),e.blob(.17*s,.12*o,.24*s,{at:[i,u+.055*o,d+.03],color:t.boots,bone:n,shine:O*.6},12),!t.bones&&!t.robe&&(e.blob(.18*s,.035*o,.255*s,{at:[i,u+.014*o,d+.035],color:Id(t.boots,-.4),bone:n},10),e.torus(.068*s+E*.5,.022*o,{at:[i,u+.115*o,d+.01],rot:[Math.PI/2,0,0],color:Id(t.boots,.18),bone:n},10)))}e.bone=b;let k=p+m*.48;if(t.bones){e.cyl(.035*s,.035*s,m,{at:[l,k,d-.02],color:t.torso});for(let n=0;n<3;n++)e.torus(.13*s-n*.012,.022*s,{at:[l,p+m*(.42+n*.17),d],rot:[Math.PI/2,0,0],color:t.torso},12);e.blob(.26*s,.1*o,.18*s,{at:[l,p+.02,d],color:t.torso})}else e.blob(.5*s,m*1.08,.4*s,{at:[l,k,d],color:t.torso,shine:O},12),t.belly&&e.blob(.4*s,m*.7,.3*s,{at:[l,k-.03,d+.09*s],color:t.torso,shine:O},10),t.torso2&&(e.torus(.235*s,.035*o,{at:[l,p+.05*o,d],rot:[Math.PI/2,0,0],scale:[1,.85,1],color:t.torso2},14),e.box(.075*s,.06*o,.03,{at:[l,p+.05*o,d+.2*s+.03*o],color:`#f2c94c`,shine:.9}),e.box(.04*s,.03*o,.032,{at:[l,p+.05*o,d+.2*s+.033*o],color:Id(t.torso2,-.3)})),!t.scarf&&!t.robe&&e.torus(.1*s+.02,.028*o,{at:[l,h-.03*o,d],rot:[Math.PI/2,0,0],color:Id(t.torso,-.22),shine:O*.8},12),t.apron&&e.cone(.29*s,.22*o,{at:[l,p-.02,d],rot:[Math.PI,0,0],scale:[1,1,.85],color:t.apron},12),t.robe&&e.cyl(.2*s,.3*s,f+.06,{at:[l,u+(f+.06)/2,d],color:t.apron??t.torso},12);t.sash&&e.box(.1*s,m*1.05,.42*s,{at:[l,k,d],rot:[0,0,.7],color:n.main}),t.strap&&(e.box(.055*s,m*1.08,.43*s,{at:[l,k,d],rot:[0,0,-.62],color:t.strap}),e.box(.07*s,.07*s,.03,{at:[l-.02*s,k+.02,d+.215*s],rot:[0,0,-.62],color:`#d9b04a`,shine:.9})),t.tabard&&(e.blob(.3*s,m*.92,.07*s,{at:[l,k-.01,d+.175*s],color:n.main},12),e.cone(.15*s,.12*o,{at:[l,p-.02*o,d+.19*s],rot:[Math.PI,0,0],scale:[1,1,.3],color:n.main},3),e.box(.08*s,.08*s,.03,{at:[l,k+m*.08,d+.215*s],rot:[0,0,Math.PI/4],color:`#f2c94c`,shine:.9})),t.scarf&&(e.torus(.11*s+.04,.045*o,{at:[l,h-.03,d],rot:[Math.PI/2,0,0],color:n.main},12),e.box(.08*o,.18*o,.03,{at:[l+.06,h-.12,d-.13*s],rot:[.3,0,.2],color:n.main})),t.cape&&(e.box(.44*s,m*1.25+f*.6,.04,{at:[l,p+m*.35,d-.21*s],rot:[-.12,0,0],color:n.main}),e.box(.46*s,.06,.08,{at:[l,h-.03,d-.18*s],color:n.dark}));for(let[r,i]of[[S,1],[C,-1]]){let a=l+i*_;e.capsule(E*.95,D*.6,{at:[a+i*.02,v-D*.45,d],rot:[0,0,i*.12],color:t.bones?t.torso:t.arms??t.torso,bone:r,shine:t.arms===t.skin?0:O}),e.sphere(t.bones?.05*s:.085*s,{at:[a+i*.04,v-D*.95,d+.01],color:t.hands??t.skin,bone:r,shine:t.hands?O:0},10),t.bones||e.sphere(.04*s,{at:[a+i*0,v-D*.9,d+.075*s],color:t.hands??t.skin,bone:r,shine:t.hands?O:0},6),t.pads&&e.sphere((t.bones?.07:.12)*s,{at:[a+i*.015,v+.01,d],scale:[1.1,.75,1.05],color:n.main,bone:r,shine:.45},10),t.bracers&&e.cyl(E*1.28,E*1.12,D*.3,{at:[a+i*.035,v-D*.74,d],rot:[0,0,i*.12],color:t.bracers,bone:r,shine:.35},10)}let A=[l-_-.04,v-D*.95,d+.01],j=[l+_+.04,v-D*.95,d+.01];Md(e,t.weapon??`none`,A,C,o,n),Nd(e,t.offhand??`none`,j,S,o,n),e.bone=x;let ee=h+g*.92,M=t.face??`dot`;M===`skull`?(e.sphere(g,{at:[l,ee,d],scale:[.95,.9,.95],color:t.skin},14),e.blob(g*1.2,g*.55,g*1.05,{at:[l,ee-g*.62,d+g*.12],color:t.skin},10)):e.sphere(g,{at:[l,ee,d],color:t.skin},20);let N=d+g*.86,P=ee+g*.05,F=g*.38,te=t.eyeColor??`#1b1b22`;if(M===`skull`){for(let n of[1,-1])e.sphere(g*.22,{at:[l+n*F,P,N-.02],scale:[1,1.1,.6],color:t.eyeColor??`#2a1d2e`},8);e.cone(g*.1,g*.16,{at:[l,P-g*.3,N],rot:[Math.PI,0,0],color:`#3a2d33`},4)}else if(M===`visor`){e.box(g*1.5,g*.16,.05,{at:[l,P,N+.02],color:`#141418`});for(let n of[1,-1])e.sphere(g*.08,{at:[l+n*F*.8,P,N+.045],color:t.eyeColor??`#ff4a3a`},6)}else if(M===`glow`)for(let n of[1,-1])e.sphere(g*.14,{at:[l+n*F,P,N],scale:[1.2,.8,.6],color:t.eyeColor??`#ffb347`},8);else if(M===`happy`||M===`laugh`||M===`wink`)for(let t of[1,-1])M===`wink`&&t===-1?(e.sphere(g*.16,{at:[l+t*F,P,N],scale:[.85,1.2,.6],color:te},8),e.sphere(g*.055,{at:[l+t*F+.015,P+g*.07,N+g*.08],color:`#ffffff`},6)):e.torus(g*.14,g*.04,{at:[l+t*F,P-g*(M===`laugh`?.06:.03),N+.012],color:te},8,Math.PI);else if(M===`wow`)for(let t of[1,-1])e.sphere(g*.21,{at:[l+t*F,P+g*.03,N-.005],scale:[1,1.15,.5],color:`#ffffff`},10),e.sphere(g*.08,{at:[l+t*F,P+g*.03,N+g*.09],color:te},8);else for(let n of[1,-1]){let r=M===`sleepy`?P-g*.04:P;e.sphere(g*.16,{at:[l+n*F,r,N],scale:[.85,M===`sleepy`?.3:1.2,.6],color:te},8),M!==`sleepy`&&e.sphere(g*.055,{at:[l+n*F+.015,r+g*.07,N+g*.08],color:`#ffffff`},6),M===`angry`&&e.box(g*.36,g*.08,.04,{at:[l+n*F,P+g*.22,N+.01],rot:[0,0,n*-.42],color:t.hair?.color??`#3a2a1e`})}if(M===`dot`||M===`sleepy`||M===`happy`||M===`laugh`||M===`wink`||M===`wow`){let n=t.hair?.color??t.beard?.color??Id(t.skin,-.55),r=M===`wow`?.38:M===`laugh`?.3:M===`sleepy`?.17:.27,i=M===`sleepy`?.28:M===`wow`?.15:-.12;for(let t of[1,-1])e.box(g*.3,g*.07,.035,{at:[l+t*F,P+g*r,d+g*.9],rot:[-.35,0,t*i],color:n})}if(M!==`skull`&&M!==`visor`&&M!==`glow`&&!(t.beard&&(t.beard.size??1)>=.7)){let n=P-g*(t.mustache?.5:.44),r=d+g*.95;M===`angry`?(e.box(g*.42,g*.15,.03,{at:[l,n,r],color:`#3a1a1a`}),e.box(g*.36,g*.06,.035,{at:[l,n+g*.025,r+.004],color:`#f4f1e8`})):M===`sleepy`?e.sphere(g*.08,{at:[l,n,r],scale:[1,.8,.5],color:`#5a2a2a`},6):M===`laugh`?(e.blob(g*.42,g*.3,g*.12,{at:[l,n-g*.04,r],color:`#4a1414`},10),e.blob(g*.24,g*.1,g*.08,{at:[l,n-g*.13,r+.01],color:`#ff8a9a`},8)):M===`wow`?e.torus(g*.09,g*.035,{at:[l,n-g*.03,r+.005],color:`#4a1414`},10):e.torus(g*.15,g*.035,{at:[l,n+g*.07,r],rot:[0,0,Math.PI],color:`#5a2a2a`},8,Math.PI)}let ne=[`helmet`,`iron`,`hood`,`wizard`,`witch`,`skull`].includes(t.hat??`none`);if(t.ears===void 0&&(M===`dot`||M===`angry`||M===`sleepy`)&&!ne)for(let n of[1,-1])e.sphere(g*.17,{at:[l+n*g*.96,ee-g*.05,d-g*.05],scale:[.5,1,.8],color:Id(t.skin,-.05)},8);if(M===`dot`||M===`sleepy`)for(let n of[1,-1])e.sphere(g*.13,{at:[l+n*F*1.15,P-g*.22,d+g*.88],scale:[1.2,.7,.35],color:Fd(t.skin,`#ff6f73`,.38)},8);let re=t.nose??`ball`;if(M!==`skull`&&M!==`visor`&&(re===`ball`&&e.sphere(g*.15,{at:[l,P-g*.2,N+g*.08],color:Id(t.skin,-.12)},8),re===`long`&&e.cone(g*.13,g*.5,{at:[l,P-g*.18,N+g*.2],rot:[Math.PI/2,0,0],color:Id(t.skin,-.1)},8)),t.ears===`pointy`)for(let n of[1,-1])e.cone(g*.22,g*.75,{at:[l+n*g*1,ee+g*.12,d],rot:[0,0,-n*1.25],color:t.skin},6);else if(t.ears===`round`)for(let n of[1,-1])e.sphere(g*.18,{at:[l+n*g*.97,ee,d],scale:[.5,1,.8],color:t.skin},6);if(t.beard){let n=t.beard.size??1;e.blob(g*1.25*n,g*.95*n,g*.8,{at:[l,ee-g*.55,d+g*.45],color:t.beard.color},10)}if(t.mustache)for(let n of[1,-1])e.capsule(g*.1,g*.28,{at:[l+n*g*.2,P-g*.36,N+.01],rot:[0,0,n*1.2],color:t.mustache},6);return t.hair&&Ad(e,t.hair,l,ee,d,g),jd(e,t.hat??`none`,t,l,ee,d,g,n),{hips:y,spine:b,head:x,armL:S,armR:C,legL:w,legR:T}}function Ad(e,t,n,r,i,a){let o=t.color;switch(t.style){case`tuft`:e.cone(a*.25,a*.5,{at:[n,r+a*1.05,i],rot:[.3,0,0],color:o},6);break;case`bob`:e.sphere(a*1.06,{at:[n,r+a*.12,i-a*.12],scale:[1,.92,.95],color:o},12);break;case`long`:e.sphere(a*1.06,{at:[n,r+a*.12,i-a*.14],scale:[1,.95,.95],color:o},12),e.blob(a*1.7,a*1.4,a*.6,{at:[n,r-a*.55,i-a*.62],color:o},10);break;case`mohawk`:e.box(a*.22,a*.55,a*1.3,{at:[n,r+a*1,i-a*.1],color:o});break;case`braids`:e.sphere(a*1.05,{at:[n,r+a*.15,i-a*.12],scale:[1,.9,.95],color:o},12);for(let t of[1,-1])e.capsule(a*.16,a*.8,{at:[n+t*a*.85,r-a*.55,i-a*.05],color:o},6)}}function jd(e,t,n,r,i,a,o,s){let c=n.hatColor??`#9aa3ad`,l=n.hatColor2??s.main;switch(t){case`helmet`:case`crest`:e.shell(o*1.1,{at:[r,i+o*.05,a-o*.05],rot:[-.55,0,0],color:c,shine:.85},Math.PI*.56),e.torus(o*.93,o*.09,{at:[r,i+o*.62,a+o*.35],rot:[Math.PI/2-.55,0,0],color:Id(c,-.15),shine:.85},16),(n.plume||t===`crest`)&&e.blob(o*.3,o*.75,o*1.3,{at:[r,i+o*1.12,a-o*.25],rot:[.35,0,0],color:l},8);break;case`horned`:e.shell(o*1.09,{at:[r,i+o*.08,a-o*.05],rot:[-.5,0,0],color:c,shine:.8},Math.PI*.52),e.torus(o*.9,o*.08,{at:[r,i+o*.66,a+o*.32],rot:[Math.PI/2-.5,0,0],color:l,shine:.4},16);for(let t of[1,-1])e.cone(o*.2,o*.75,{at:[r+t*o*.95,i+o*.62,a-o*.1],rot:[0,0,-t*.9],color:`#efe3c2`},8);break;case`winged`:e.shell(o*1.09,{at:[r,i+o*.08,a-o*.05],rot:[-.5,0,0],color:c,shine:.8},Math.PI*.52);for(let t of[1,-1])e.blob(o*.15,o*.7,o*.55,{at:[r+t*o*.95,i+o*.6,a-o*.15],rot:[0,0,-t*.5],color:`#f4f1e8`},8);e.box(o*.55,o*.13,o*.13,{at:[r,i+o*.72,a+o*.55],rot:[-.5,0,0],color:l,shine:.4});break;case`iron`:e.sphere(o*1.12,{at:[r,i+o*.05,a],scale:[1,1.05,1],color:c,shine:.85},14),e.blob(o*.22,o*.9,o*1.7,{at:[r,i+o*1.05,a-o*.15],color:l,shine:.25},8);for(let t of[1,-1])e.blob(o*.25,o*.85,o*.8,{at:[r+t*o*.95,i-o*.25,a+o*.2],color:Id(c,-.2),shine:.85},8);break;case`wizard`:case`witch`:{let n=t===`witch`?-.55:-.3;e.cyl(o*1.18,o*1.22,o*.1,{at:[r,i+o*.72,a-o*.1],rot:[-.3,0,0],color:c},16),e.cone(o*.78,o*1.6,{at:[r,i+o*1.45,a-o*.45],rot:[n,0,0],color:c},12),e.torus(o*.78,o*.09,{at:[r,i+o*.8,a-o*.12],rot:[Math.PI/2-.3,0,0],color:l},14);break}case`hood`:e.shell(o*1.16,{at:[r,i+o*.04,a-o*.08],color:c},Math.PI*.82,Math.PI/2+.85,Math.PI*2-1.7),e.cone(o*.45,o*.8,{at:[r,i+o*.55,a-o*1],rot:[-1.25,0,0],color:c},8);break;case`cap`:e.cyl(o*.98,o*.98,o*.1,{at:[r,i+o*.7,a-o*.05],rot:[-.25,0,.15],color:c},14),e.sphere(o*.75,{at:[r,i+o*.8,a-o*.1],scale:[1,.5,1],color:c},10),e.blob(o*.25,o*.25,o*1.6,{at:[r-o*.6,i+o*1,a-o*.45],rot:[.9,.3,0],color:l},8);break;case`band`:case`bandana`:e.torus(o*.98,o*.12,{at:[r,i+o*.38,a],rot:[Math.PI/2-.15,0,0],color:l},16),t===`bandana`&&e.blob(o*.3,o*.15,o*.6,{at:[r+o*.4,i+o*.3,a-o*1.05],rot:[.5,0,.4],color:l},6);break;case`skull`:e.shell(o*1.06,{at:[r,i+o*.08,a-o*.05],rot:[-.45,0,0],color:c},Math.PI*.45);break;case`hardhat`:e.shell(o*1.12,{at:[r,i+o*.12,a-o*.04],rot:[-.35,0,0],color:c,shine:.5},Math.PI*.5),e.cyl(o*1.22,o*1.22,o*.08,{at:[r,i+o*.55,a+o*.05],rot:[-.35,0,0],color:Id(c,-.12),shine:.5},16),e.box(o*.16,o*.6,o*.16,{at:[r,i+o*1.05,a-o*.1],rot:[-.35,0,0],color:Id(c,.12),shine:.5}),e.cyl(o*.2,o*.2,o*.18,{at:[r,i+o*.82,a+o*.9],rot:[Math.PI/2-.35,0,0],color:`#4a4a52`,shine:.6},10),e.sphere(o*.16,{at:[r,i+o*.86,a+o*1],color:`#fff3a0`,shine:.9},8);break;case`royal`:e.torus(o*.98,o*.17,{at:[r,i+o*.62,a-o*.05],rot:[Math.PI/2-.2,0,0],color:`#f4f1e8`},16),e.sphere(o*.92,{at:[r,i+o*1.02,a-o*.12],scale:[1,.72,1],color:l},14),e.torus(o*.86,o*.05,{at:[r,i+o*.82,a-o*.08],rot:[Math.PI/2-.2,0,0],color:`#f2b233`,shine:.9},16),e.sphere(o*.17,{at:[r,i+o*1.55,a-o*.2],color:`#f2b233`,shine:.9},8),e.gem(o*.15,{at:[r,i+o*.78,a+o*.86],color:`#7fd6ff`,shine:1});break;case`goggles`:e.torus(o*.98,o*.09,{at:[r,i+o*.32,a],rot:[Math.PI/2-.2,0,0],color:`#4a3a2a`},16);for(let t of[1,-1])e.cyl(o*.22,o*.22,o*.18,{at:[r+t*o*.32,i+o*.45,a+o*.85],rot:[Math.PI/2-.3,0,0],color:`#c9a24a`,shine:.8},10)}}function Md(e,t,n,r,i,a){let[o,s,c]=n,l=`#dfe5ec`,u=`#8a5a2e`,d=`#f2b233`;switch(t){case`sword`:e.box(.07*i,.5*i,.025*i,{at:[o,s+.27*i,c+.04],color:l,bone:r,shine:1}),e.box(.2*i,.04*i,.05*i,{at:[o,s+.03*i,c+.04],color:d,bone:r,shine:.9}),e.cyl(.025*i,.025*i,.1*i,{at:[o,s-.04*i,c+.04],color:u,bone:r},6);break;case`greatsword`:e.box(.13*i,.82*i,.04*i,{at:[o,s+.45*i,c+.06],color:`#c9d1dc`,bone:r,shine:1}),e.box(.05*i,.7*i,.045*i,{at:[o,s+.45*i,c+.065],color:a.light,bone:r,shine:.6}),e.box(.32*i,.06*i,.08*i,{at:[o,s+.03*i,c+.06],color:`#3a3f4a`,bone:r,shine:.7}),e.cyl(.03*i,.03*i,.16*i,{at:[o,s-.06*i,c+.06],color:`#2a2d33`,bone:r},6);break;case`axe2`:e.cyl(.03*i,.03*i,.9*i,{at:[o,s+.25*i,c+.05],color:u,bone:r},6);for(let t of[1,-1])e.add(new so(.24*i,.24*i,.035*i,14,1,!1,t>0?0:Math.PI,Math.PI),{at:[o+t*.03*i,s+.6*i,c+.05],rot:[0,0,Math.PI/2],scale:[1,1,1.15],color:l,bone:r,shine:1});e.cyl(.06*i,.06*i,.14*i,{at:[o,s+.6*i,c+.05],color:`#8a6a3a`,bone:r,shine:.5},8);break;case`club`:e.cyl(.07*i,.035*i,.45*i,{at:[o,s+.2*i,c+.05],color:u,bone:r},7);for(let t=0;t<4;t++){let n=t/4*Math.PI*2;e.cone(.025*i,.06*i,{at:[o+Math.cos(n)*.07*i,s+.36*i,c+.05+Math.sin(n)*.07*i],rot:[Math.sin(n)*1.4,0,-Math.cos(n)*1.4],color:`#d9d2c0`,bone:r},4)}break;case`cleaver`:e.box(.18*i,.32*i,.025*i,{at:[o-.05*i,s+.24*i,c+.05],color:l,bone:r,shine:1}),e.cyl(.03*i,.03*i,.14*i,{at:[o,s+.02*i,c+.05],color:u,bone:r},6);break;case`spear`:e.cyl(.022*i,.022*i,.95*i,{at:[o,s+.2*i,c+.04],color:u,bone:r},6),e.cone(.05*i,.16*i,{at:[o,s+.75*i,c+.04],color:l,bone:r,shine:1},6);break;case`lance`:e.cone(.08*i,1.25*i,{at:[o,s+.1*i,c+.62*i],rot:[Math.PI/2,0,0],color:`#d9d2c0`,bone:r,shine:.5},10),e.cone(.13*i,.18*i,{at:[o,s+.1*i,c+.02],rot:[-Math.PI/2,0,0],color:a.main,bone:r,shine:.5},10);break;case`musket`:e.cyl(.03*i,.03*i,.75*i,{at:[o+.06*i,s-.06*i,c+.05],color:`#2c2f36`,bone:r,shine:.75},8),e.box(.07*i,.3*i,.1*i,{at:[o+.06*i,s+.36*i,c+.05],color:u,bone:r});break;case`handcannon`:e.cyl(.12*i,.1*i,.56*i,{at:[o+.04*i,s-.12*i,c+.1*i],color:`#3a3d44`,bone:r,shine:.7},12);for(let t of[-.38,.1])e.torus(.115*i,.03*i,{at:[o+.04*i,s+t*i,c+.1*i],rot:[Math.PI/2,0,0],color:`#b87333`,bone:r,shine:.85},12);e.box(.14*i,.22*i,.14*i,{at:[o+.04*i,s+.24*i,c+.1*i],color:u,bone:r});break;case`blowpipe`:e.cyl(.022*i,.026*i,.62*i,{at:[o+.02*i,s-.04*i,c+.06],color:`#8a6a3a`,bone:r},6);for(let t of[-.3,.2])e.torus(.03*i,.012*i,{at:[o+.02*i,s+t*i,c+.06],rot:[Math.PI/2,0,0],color:`#c9a24a`,bone:r,shine:.8},8);break;case`handaxe`:Pd(e,o,s,c,i,r,-1);break;case`crossbow`:e.box(.06*i,.06*i,.42*i,{at:[o,s+.04*i,c+.16*i],color:u,bone:r}),e.torus(.2*i,.02*i,{at:[o,s+.04*i,c+.3*i],rot:[Math.PI/2,0,0],color:`#5a3a1e`,bone:r},10,Math.PI);break;case`staff`:case`skullstaff`:if(e.cyl(.025*i,.03*i,1*i,{at:[o,s+.25*i,c+.04],color:`#6b4426`,bone:r},6),t===`staff`)e.sphere(.1*i,{at:[o,s+.8*i,c+.04],color:`#ffb347`,bone:r,shine:.7},10),e.torus(.1*i,.025*i,{at:[o,s+.75*i,c+.04],rot:[Math.PI/2,0,0],color:d,bone:r,shine:.9},10);else{e.sphere(.11*i,{at:[o,s+.82*i,c+.04],scale:[1,1.05,1],color:`#efe8d8`,bone:r},10);for(let t of[1,-1])e.sphere(.03*i,{at:[o+t*.04*i,s+.83*i,c+.13*i],color:`#7dff8a`,bone:r},6)}break;case`bomb`:e.sphere(.14*i,{at:[o,s+.08*i,c+.08],color:`#2a2c33`,bone:r,shine:.55},10),e.cyl(.02*i,.02*i,.08*i,{at:[o,s+.24*i,c+.08],color:`#c9a24a`,bone:r},5),e.sphere(.035*i,{at:[o,s+.29*i,c+.08],color:`#ffd36b`,bone:r},6);break;case`pickaxe`:e.cyl(.03*i,.03*i,.75*i,{at:[o,s+.24*i,c+.05],color:u,bone:r},6),e.cone(.05*i,.32*i,{at:[o+.15*i,s+.6*i,c+.05],rot:[0,0,-Math.PI/2-.25],color:`#9aa3ad`,bone:r,shine:1},6),e.cone(.05*i,.32*i,{at:[o-.15*i,s+.6*i,c+.05],rot:[0,0,Math.PI/2+.25],color:`#9aa3ad`,bone:r,shine:1},6),e.box(.1*i,.1*i,.1*i,{at:[o,s+.6*i,c+.05],color:`#6b7078`,bone:r,shine:.7});break;case`scepter`:e.cyl(.028*i,.028*i,.62*i,{at:[o,s+.24*i,c+.05],color:d,bone:r,shine:.9},6),e.sphere(.085*i,{at:[o,s+.6*i,c+.05],color:d,bone:r,shine:.9},10),e.gem(.07*i,{at:[o,s+.71*i,c+.05],color:a.light,bone:r,shine:1}),e.torus(.07*i,.018*i,{at:[o,s+.5*i,c+.05],rot:[Math.PI/2,0,0],color:d,bone:r,shine:.9},10);break;case`mace`:e.cyl(.03*i,.03*i,.42*i,{at:[o,s+.18*i,c+.05],color:u,bone:r},6),e.sphere(.1*i,{at:[o,s+.42*i,c+.05],color:`#5d636e`,bone:r,shine:.8},8);for(let t=0;t<5;t++){let n=t/5*Math.PI*2;e.cone(.025*i,.08*i,{at:[o+Math.cos(n)*.1*i,s+.42*i,c+.05+Math.sin(n)*.1*i],rot:[Math.sin(n)*1.57,0,-Math.cos(n)*1.57],color:`#c9ced6`,bone:r,shine:1},4)}}}function Nd(e,t,n,r,i,a){let[o,s,c]=n;switch(t){case`shield`:e.cyl(.24*i,.24*i,.05*i,{at:[o+.06*i,s+.1*i,c+.07*i],rot:[0,0,Math.PI/2],color:a.main,bone:r,shine:.3},14),e.torus(.24*i,.03*i,{at:[o+.09*i,s+.1*i,c+.07*i],rot:[0,Math.PI/2,0],color:`#cfd5dc`,bone:r,shine:1},16),e.sphere(.06*i,{at:[o+.1*i,s+.1*i,c+.07*i],color:`#f2b233`,bone:r,shine:.9},8);break;case`buckler`:e.cyl(.15*i,.15*i,.04*i,{at:[o+.05*i,s+.06*i,c+.04],rot:[0,0,Math.PI/2],color:`#7a5230`,bone:r},10),e.sphere(.04*i,{at:[o+.08*i,s+.06*i,c+.04],color:a.main,bone:r,shine:.6},6);break;case`bow`:e.torus(.32*i,.025*i,{at:[o+.03,s+.05*i,c+.1*i],rot:[0,Math.PI/2,0],color:`#8b5a2b`,bone:r},12,Math.PI),e.cyl(.006,.006,.64*i,{at:[o+.03,s+.05*i,c+.1*i],color:`#f1e7d0`,bone:r},3);break;case`lantern`:e.box(.12*i,.16*i,.12*i,{at:[o,s-.06*i,c+.04],color:`#ffd36b`,bone:r});break;case`handaxe`:Pd(e,o,s,c,i,r,1)}}function Pd(e,t,n,r,i,a,o){e.cyl(.025*i,.03*i,.44*i,{at:[t,n+.13*i,r+.05],color:`#7a5230`,bone:a},6),e.add(new so(.15*i,.15*i,.03*i,12,1,!1,o>0?0:Math.PI,Math.PI),{at:[t+o*.02*i,n+.3*i,r+.05],rot:[Math.PI/2,0,0],color:`#dfe5ec`,bone:a,shine:1}),e.box(.05*i,.1*i,.05*i,{at:[t,n+.3*i,r+.05],color:`#5d636e`,bone:a,shine:.7})}function Fd(e,t,n){let r=parseInt(e.slice(1),16),i=parseInt(t.slice(1),16),a=e=>Math.round((r>>e&255)*(1-n)+(i>>e&255)*n);return`#${(a(16)<<16|a(8)<<8|a(0)).toString(16).padStart(6,`0`)}`}function Id(e,t){let n=parseInt(e.slice(1),16),r=n>>16&255,i=n>>8&255,a=n&255,o=e=>Math.max(0,Math.min(255,Math.round(t>0?e+(255-e)*t:e*(1+t))));return r=o(r),i=o(i),a=o(a),`#${(r<<16|i<<8|a).toString(16).padStart(6,`0`)}`}function Ld(e,t){let n=new wd;return kd(n,e,t,n.addBone(`root`,-1,[0,0,0])),n.build(e.height)}var Rd=`#b9b4aa`,zd=`#8f8a80`,Bd=`#d6d1c6`,Vd=`#8a5a2e`,Hd=`#5a3a1e`;function Ud(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`turret`,n,[0,.42,0]),i=t.addBone(`barrel`,r,[0,.62,0]);t.bone=n,t.cyl(.8,.88,.3,{at:[0,.15,0],color:Hd},10),t.cyl(.74,.8,.12,{at:[0,.34,0],color:Vd},10);for(let n=0;n<8;n++){let r=n/8*Math.PI*2;t.box(.12,.08,.12,{at:[Math.cos(r)*.72,.42,Math.sin(r)*.72],color:e.main})}t.bone=r,t.box(.5,.32,.55,{at:[0,.55,-.05],color:Vd});for(let e of[1,-1])t.cyl(.18,.18,.08,{at:[e*.3,.5,.05],rot:[0,0,Math.PI/2],color:`#3a2a1e`},10);return t.bone=i,t.cyl(.15,.2,.85,{at:[0,.68,.3],rot:[Math.PI/2-.15,0,0],color:`#363a42`,shine:.7},12),t.torus(.16,.04,{at:[0,.74,.68],rot:[-.15,0,0],color:`#555b66`,shine:.8},12),t.sphere(.2,{at:[0,.62,-.08],color:`#2c3036`,shine:.7},10),t.build(1)}function Wd(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`crystal`,n,[0,1.55,0]);t.bone=n,t.cyl(.62,.8,.35,{at:[0,.18,0],color:zd},8),t.cyl(.42,.58,1,{at:[0,.82,0],color:`#5c5250`},8);for(let e=0;e<4;e++){let n=e/4*Math.PI*2+Math.PI/4;t.box(.16,.9,.16,{at:[Math.cos(n)*.5,.8,Math.sin(n)*.5],rot:[0,-n,0],color:`#3e3634`})}t.cyl(.55,.45,.16,{at:[0,1.35,0],color:`#3e3634`},8),t.torus(.5,.06,{at:[0,1.4,0],rot:[Math.PI/2,0,0],color:e.main},14);for(let e=0;e<6;e++){let n=e/6*Math.PI*2;t.cone(.07,.3,{at:[Math.cos(n)*.42,1.55,Math.sin(n)*.42],rot:[Math.sin(n)*.4,0,-Math.cos(n)*.4],color:`#2c2624`},5)}return t.bone=r,t.gem(.3,{at:[0,1.75,0],scale:[.8,1.4,.8],color:`#ff6a1f`,shine:1}),t.gem(.16,{at:[0,1.78,0],scale:[.8,1.4,.8],color:`#ffd36b`,shine:1}),t.build(2)}function Gd(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`stone`,n,[0,.1,0]);t.bone=n,t.blob(1.6,.25,1.4,{at:[0,.06,.1],color:`#6e5a40`},10);for(let e=0;e<5;e++)t.rock(.12,{at:[Math.cos(e*1.3)*.6,.1,.35+Math.sin(e*1.3)*.35],color:`#7d7468`});t.bone=r,t.box(.95,1.05,.28,{at:[0,.62,-.25],color:`#8d8a95`}),t.cyl(.475,.475,.28,{at:[0,1.14,-.25],rot:[Math.PI/2,0,0],color:`#8d8a95`},14),t.box(.75,.08,.06,{at:[0,.95,-.1],color:`#6a6774`}),t.sphere(.17,{at:[0,.72,-.08],scale:[1,1,.5],color:`#e8e2d2`},10);for(let e of[1,-1])t.sphere(.045,{at:[e*.06,.74,0],color:`#2a1d2e`},6);return t.box(.98,.12,.3,{at:[0,.18,-.25],color:e.main}),t.cyl(.05,.05,.22,{at:[.35,.35,.18],color:`#efe3c2`},6),t.sphere(.045,{at:[.35,.5,.18],color:`#ffd36b`},6),t.build(1.4)}function Kd(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`crystal`,n,[0,1.45,0]);t.bone=n,t.cyl(.92,.98,.18,{at:[0,.09,0],color:zd},14),t.cyl(.78,.86,.5,{at:[0,.38,0],color:Rd},14);for(let e=0;e<10;e++){let n=e/10*Math.PI*2;t.box(.3,.14,.18,{at:[Math.cos(n)*.8,.66,Math.sin(n)*.8],rot:[0,-n,0],color:Bd})}t.cyl(.7,.7,.05,{at:[0,.66,0],color:`#d35ad8`},18),t.cyl(.38,.38,.05,{at:[0,.675,0],color:`#f2a8f2`},14);for(let e of[1,-1])t.box(.12,1.5,.12,{at:[e*.72,.95,0],color:Vd}),t.box(.16,.14,.2,{at:[e*.72,1.72,0],color:Hd});return t.box(1.6,.12,.12,{at:[0,1.82,0],color:Vd}),t.cyl(.02,.02,.18,{at:[0,1.7,0],color:`#4a4a52`},4),t.box(.04,.3,.3,{at:[.8,1.98,.12],color:e.main}),t.cyl(.025,.025,.4,{at:[.78,1.95,0],color:Hd},5),t.cyl(.1,.12,.26,{at:[.95,.13,.55],color:`#8a5a2e`},8),t.sphere(.12,{at:[-.95,.12,.5],color:`#c85ad0`},8),t.cyl(.04,.04,.08,{at:[-.95,.27,.5],color:`#8a5a2e`},6),t.bone=r,t.gem(.3,{at:[0,1.32,0],scale:[.85,1.45,.85],color:`#e25ae8`,shine:1}),t.gem(.17,{at:[0,1.34,0],scale:[.85,1.45,.85],color:`#ffd0ff`,shine:1}),t.torus(.26,.03,{at:[0,1.32,0],rot:[Math.PI/2,0,0],color:`#f2b233`,shine:.9},14),t.build(2)}var qd=`#f2b233`,Jd=`#c98a1a`;function Yd(e,t,n,r,i,a,o=0){return e.frustum(t,r,t,i,{at:[0,n+r/2,o],color:a}),e=>t/2*(1-(1-i)*Math.min(1,Math.max(0,(e-n)/r)))}function Xd(e,t,n,r,i=0){n.forEach((n,a)=>{let o=t(n)+.015;e.box(o*2,.045,o*2,{at:[0,n,i],color:zd});let s=n+r/2,c=t(s),l=a%2==0;for(let[t,n]of[[1,1],[1,-1],[-1,1],[-1,-1]])e.box(l?.5:.32,r-.06,l?.32:.5,{at:[t*(c-(l?.2:.11)),s,i+n*(c-(l?.11:.2))],color:Bd})})}function Zd(e,t,n,r,i,a=0){let o=r*2+1;for(let r=0;r<o;r++){let i=-t+.18+r*(t*2-.36)/(o-1);for(let r of[-1,1])e.box(.16,.2,.2,{at:[i,n-.1,a+r*(t-.04)],color:zd}),e.box(.2,.2,.16,{at:[r*(t-.04),n-.1,a+i],color:zd})}e.box(t*2+.12,.12,t*2+.12,{at:[0,n+.06,a],color:zd});for(let r of[-1,1])e.box(t*2+.1,i,.24,{at:[0,n+.12+i/2,a+r*(t-.07)],color:Rd}),e.box(.24,i,t*2+.1,{at:[r*(t-.07),n+.12+i/2,a],color:Rd});let s=n+.12+i,c=(t*2-.3)/(r-1);for(let n=0;n<r;n++){let i=-t+.15+n*c;for(let o of[-1,1])e.box(.3,.26,.28,{at:[i,s+.13,a+o*(t-.07)],color:Bd}),n>0&&n<r-1&&e.box(.28,.26,.3,{at:[o*(t-.07),s+.13,a+i],color:Bd})}}function Qd(e,t,n,r,i,a,o,s,c){e.box(i+.12,.08,.1,{at:[t,n,r],color:Hd}),e.box(i,a,.05,{at:[t,n-a/2,r+c*.02],color:o}),e.box(i,.06,.06,{at:[t,n-.12,r+c*.03],color:s});for(let s of[-1,1])e.cone(i/4,.28,{at:[t+i/4*s,n-a-.13,r+c*.02],rot:[Math.PI,0,0],scale:[1,1,.2],color:o},3)}function $d(e,t,n,r,i){e.cyl(.17*i,.17*i,.06,{at:[t,n,r],rot:[Math.PI/2,0,0],color:qd},12),e.cyl(.09*i,.09*i,.07,{at:[t,n,r+.01],rot:[Math.PI/2,0,0],color:`#fff2b0`},10);for(let a=0;a<8;a++){let o=a/8*Math.PI*2,s=(a%2?.24:.29)*i;e.cone(.055*i,(a%2?.1:.15)*i,{at:[t+Math.sin(o)*s,n+Math.cos(o)*s,r],rot:[0,0,-o],scale:[1,1,.3],color:Jd},3)}}function ef(e,t,n,r,i){e.cyl(r*.94,r,i,{at:[t,.3+i/2,n],color:Bd},14);for(let a of[.9,1.5,2.1])a<i&&e.cyl(r*.99,r*.99,.05,{at:[t,a,n],color:zd},14);e.cyl(r*1.1,r*.98,.16,{at:[t,.3+i+.02,n],color:zd},14);for(let a=0;a<7;a++){let o=a/7*Math.PI*2+.2;e.box(.24,.26,.2,{at:[t+Math.sin(o)*r*.98,.3+i+.23,n+Math.cos(o)*r*.98],rot:[0,o,0],color:Rd})}}function tf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=2.86,i=t.addBone(`top`,n,[0,r,0]);t.bone=n,t.box(2.95,.18,2.95,{at:[0,.09,0],color:zd}),t.box(2.72,.14,2.72,{at:[0,.25,0],color:Rd});let a=Yd(t,2.5,.32,2.36,.87,Rd);Xd(t,a,[.76,1.2,1.64,2.08,2.52],.44),Zd(t,1.18,2.68,3,.3),t.box(2.05,.06,2.05,{at:[0,2.84,0],color:`#8f8576`});for(let e of[-.5,0,.5])t.box(2,.065,.03,{at:[0,2.85,e],color:`#7a7264`});let o=a(1.6)+.01;Qd(t,0,2.56,o,.78,1.3,e.main,qd,1),$d(t,0,1.75,o+.06,1.2);for(let e of[-1,1])t.box(.1,.42,.06,{at:[e*.76,1.6,a(1.6)+.01],color:`#2e2620`});let s=-(a(.8)+.01);t.box(.74,.86,.08,{at:[0,.75,s],color:Vd}),t.cyl(.37,.37,.08,{at:[0,1.18,s],rot:[Math.PI/2,0,0],color:Vd},12),t.box(.06,1.15,.1,{at:[0,.86,s-.02],color:Hd});for(let e of[.55,.98])t.box(.76,.06,.1,{at:[0,e,s-.02],color:`#4a4a52`});t.torus(.41,.06,{at:[0,1.18,s-.02],color:Bd},12,Math.PI);let c=-(a(1.75)+.01);t.cyl(.2,.2,.06,{at:[0,1.75,c-.02],rot:[Math.PI/2,0,0],color:e.main},10),t.cone(.2,.22,{at:[0,1.58,c-.02],rot:[Math.PI,0,0],scale:[1,1,.3],color:e.main},3),t.sphere(.07,{at:[0,1.76,c-.06],color:qd},6);for(let n of[-1,1])Qd(t,n*.78,2.56,-(a(2.2)+.01),.36,.7,e.main,qd,-1);t.box(.3,.34,.06,{at:[0,2.3,-(a(2.3)+.01)],color:`#2e2620`});for(let e of[-1,1])t.box(.06,.42,.1,{at:[e*(a(1.6)+.01),1.6,0],color:`#2e2620`});return t.cyl(.035,.035,1.25,{at:[.72,3.48,-.72],color:Hd},6),t.cone(.22,.6,{at:[1.02,3.94,-.72],rot:[0,0,-Math.PI/2],scale:[1,1,.12],color:e.main},3),t.sphere(.06,{at:[.72,4.13,-.72],color:qd},6),kd(t,{height:1.38,build:1.12,headScale:1.12,skin:`#f2c9a0`,face:`dot`,hair:{style:`bob`,color:`#6b3f22`},hat:`hood`,hatColor:e.main,torso:e.main,torso2:Jd,legs:`#5a4a3a`,boots:`#3a2a1e`,arms:e.dark,cape:!0,weapon:`crossbow`},e,i,[0,r,.12]),t.build(4.3)}function nf(e,t,n=1){return{height:1.7,build:1.25,headScale:1.12,skin:`#f1c39a`,face:t,nose:`ball`,mustache:`#f4f1e8`,beard:{color:`#f4f1e8`,size:n},torso:e.dark,torso2:qd,apron:e.main,legs:`#4a3a3a`,boots:`#3a2a1e`,arms:e.main,hands:`#f4f1e8`,hat:`royal`,hatColor2:e.main,cape:!0,belly:!0,weapon:`scepter`,pads:!0}}function rf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=1.38,i=1.12,a=t.addBone(`cannon`,n,[r,2.7,i]),o=t.addBone(`cannon2`,n,[-1.38,2.7,i]);t.bone=n,t.box(4.05,.18,4.05,{at:[0,.09,0],color:zd}),t.box(3.85,.14,3.85,{at:[0,.25,0],color:Rd});for(let n of[-1,1]){let r=n*1.52,i=-1.5;t.cyl(.4,.46,3.25,{at:[r,.3+1.62,i],color:Bd},12);for(let e of[1.1,2,2.9])t.cyl(.445,.445,.05,{at:[r,e,i],color:zd},12);t.cyl(.52,.48,.14,{at:[r,3.6,i],color:zd},12),t.cone(.58,.95,{at:[r,4.14,i],color:e.main},12),t.cone(.6,.14,{at:[r,3.72,i],color:e.dark},12),t.sphere(.1,{at:[r,4.66,i],color:qd},6)}let s=-.3,c=Yd(t,2.55,.32,2.5,.9,Rd,s);Xd(t,c,[.8,1.28,1.76,2.24],.48,s),Zd(t,1.24,2.82,4,.24,s),t.box(2.2,.06,2.2,{at:[0,2.98,s],color:`#9a7a52`});let l=1.2000000000000002;t.box(1.9,1.45,.4,{at:[0,1.02,l],color:Rd});for(let e=0;e<4;e++)t.box(.28,.22,.4,{at:[-.69+e*.46,1.86,l],color:Bd});t.box(.84,.9,.06,{at:[0,.75,1.4000000000000001],color:`#3a2a20`}),t.cyl(.42,.42,.06,{at:[0,1.2,1.4000000000000001],rot:[Math.PI/2,0,0],color:`#3a2a20`},12);for(let e=0;e<5;e++)t.box(.05,1.22,.05,{at:[-.3+e*.15,.9,1.4400000000000002],color:`#5d636e`});for(let e of[.58,1])t.box(.8,.05,.05,{at:[0,e,1.4400000000000002],color:`#5d636e`});let u=s+c(2.2)+.01;Qd(t,0,2.72,u,1.05,.72,e.main,qd,1),$d(t,0,2.28,u+.06,1.2);let d=s-(c(.95)+.01);t.box(1,1.1,.08,{at:[0,.87,d],color:Vd}),t.cyl(.5,.5,.08,{at:[0,1.42,d],rot:[Math.PI/2,0,0],color:Vd},14),t.box(.06,1.6,.1,{at:[0,1.12,d-.02],color:Hd});for(let e of[.6,1.16])t.box(1.02,.07,.1,{at:[0,e,d-.02],color:`#4a4a52`});t.torus(.54,.06,{at:[0,1.42,d-.02],color:Bd},14,Math.PI),Qd(t,0,2.72,s-(c(2.4)+.01),.85,.5,e.main,qd,-1);for(let e of[-1,1])ef(t,e*r,i,.56,2.2);for(let[e,n]of[[a,1],[o,-1]]){t.bone=e;let a=n*r;t.cyl(.32,.36,.16,{at:[a,2.64,i],color:Hd},10),t.cyl(.17,.23,.95,{at:[a,2.8600000000000003,1.4200000000000002],rot:[Math.PI/2-.1,0,0],color:`#3a3530`,shine:.65},12),t.torus(.19,.05,{at:[a,2.91,1.8800000000000001],rot:[-.1,0,0],color:`#b87333`,shine:.85},12),t.sphere(.22,{at:[a,2.8200000000000003,1],color:`#3a3530`,shine:.65},10)}return t.bone=n,kd(t,nf(e,`sleepy`),e,n,[0,3,-.15]),t.build(4.75)}function af(e){let t=new wd;t.addBone(`root`,-1,[0,0,0]);let n=e/3;t.box(2.9*n,.35,2.9*n,{at:[0,.17,0],color:zd}),[[-.8,.45,.6,.45],[.7,.5,-.5,.5],[.2,.35,.9,.35],[-.5,.6,-.7,.4],[.9,.3,.8,.3],[-1,.3,-.1,.32],[.1,.75,0,.45]].forEach(([e,r,i,a],o)=>t.rock(a*n,{at:[e*n,r,i*n],color:o%2?Rd:Bd}));for(let[e,r]of[[-1.1,1.1],[1.1,-1.1],[1.15,1]])t.box(.45*n,.8,.45*n,{at:[e*n,.5,r*n],rot:[.1,.4,.15],color:Rd});return t.box(.9*n,.12,.6*n,{at:[.4*n,.42,.2*n],rot:[.3,.6,.2],color:Vd}),t.build(1)}function of(e,t){let n=new wd,r=t?.55:1,i=n.addBone(`root`,-1,[0,0,0]),a=.55*r,o=n.addBone(`hips`,i,[0,a,0]),s=n.addBone(`spine`,o,[0,a+.05*r,0]),c=n.addBone(`head`,s,[0,a+1*r,.12*r]),l=n.addBone(`armL`,s,[.68*r,a+.82*r,0]),u=n.addBone(`armR`,s,[-.68*r,a+.82*r,0]),d=n.addBone(`legL`,o,[.28*r,a,0]),f=n.addBone(`legR`,o,[-.28*r,a,0]),p=`#8b8f86`,m=`#6c7068`,h=`#6fa64a`;for(let[e,t]of[[d,1],[f,-1]])n.rock(.26*r,{at:[t*.28*r,.3*r,0],scale:[1,1.1,1.1],color:m,bone:e}),n.rock(.2*r,{at:[t*.3*r,.12*r,.08*r],scale:[1.2,.7,1.3],color:p,bone:e});n.bone=s,n.rock(.62*r,{at:[0,a+.5*r,0],scale:[1.15,.95,.9],color:p},1),n.rock(.3*r,{at:[.2*r,a+.9*r,-.25*r],color:m}),n.rock(.18*r,{at:[-.3*r,a+.95*r,.2*r],color:h}),n.rock(.14*r,{at:[.42*r,a+.7*r,.28*r],color:h}),n.gem(.13*r,{at:[0,a+.55*r,.5*r],color:e.main});for(let[e,t]of[[l,1],[u,-1]])n.rock(.25*r,{at:[t*.75*r,a+.7*r,0],color:m,bone:e}),n.rock(.3*r,{at:[t*.82*r,a+.3*r,.05*r],scale:[1,1.2,1],color:p,bone:e}),n.rock(.12*r,{at:[t*.7*r,a+.92*r,.05*r],color:h,bone:e});n.bone=c,n.rock(.3*r,{at:[0,a+1.18*r,.12*r],scale:[1.1,.85,1],color:p});for(let e of[1,-1])n.sphere(.07*r,{at:[e*.11*r,a+1.2*r,.38*r],scale:[1.2,.8,.6],color:`#ffb347`},8);return n.box(.2*r,.05*r,.06*r,{at:[0,a+1.08*r,.38*r],color:`#3a3d36`}),n.build(t?1:1.95)}function sf(e,t){let n=new wd,r=n.addBone(`root`,-1,[0,0,0]);if(n.bone=n.addBone(`body`,r,[0,.35,0]),t===`ice`){n.sphere(.3,{at:[0,.38,0],scale:[1,.95,1],color:`#bfe8ff`},14);for(let e=0;e<6;e++){let t=e/6*Math.PI*2;n.cone(.07,.3,{at:[Math.cos(t)*.2,.62,Math.sin(t)*.2],rot:[Math.sin(t)*.6,0,-Math.cos(t)*.6],color:`#e8f7ff`},5)}n.cone(.09,.36,{at:[0,.75,0],color:`#ffffff`},5)}else n.sphere(.3,{at:[0,.38,0],color:`#ff7a2a`},14),n.cone(.24,.5,{at:[0,.75,-.04],rot:[-.2,0,0],color:`#ffb347`},10),n.cone(.12,.3,{at:[.15,.7,.05],rot:[0,0,-.5],color:`#ffd36b`},8),n.cone(.12,.3,{at:[-.15,.7,.05],rot:[0,0,.5],color:`#ffd36b`},8);for(let e of[1,-1])n.sphere(.06,{at:[e*.1,.42,.26],scale:[.9,1.2,.6],color:`#1b1b22`},8),n.sphere(.022,{at:[e*.1+.015,.45,.3],color:`#ffffff`},5);return n.torus(.2,.035,{at:[0,.16,0],rot:[Math.PI/2,0,0],color:e.main},14),n.build(.85)}function cf(e,t,n,r,i,a,o){e.capsule(.03,r*.8,{at:[i[0]+t*r*.45,i[1]+.05,i[2]],rot:[0,0,t*1.35],color:a,bone:n},5),e.blob(r,.05,r*.62,{at:[i[0]+t*r*.5,i[1],i[2]-r*.12],rot:[0,t*.25,0],color:o,bone:n},8)}function lf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`body`,n,[0,.3,0]),i=t.addBone(`head`,r,[0,.42,.05]),a=t.addBone(`wingL`,r,[.12,.34,0]),o=t.addBone(`wingR`,r,[-.12,.34,0]);t.bone=r,t.sphere(.17,{at:[0,.3,0],scale:[1,1.1,.95],color:`#4b3566`},10),t.sphere(.09,{at:[0,.22,.1],color:e.main},8),t.bone=i,t.sphere(.15,{at:[0,.48,.06],color:`#5a4078`},10);for(let e of[1,-1])t.cone(.06,.18,{at:[e*.09,.64,.04],rot:[0,0,-e*.3],color:`#5a4078`},5),t.sphere(.035,{at:[e*.06,.5,.19],color:`#ffe066`},6);return t.cone(.02,.05,{at:[.03,.4,.18],rot:[Math.PI,0,0],color:`#ffffff`},4),t.cone(.02,.05,{at:[-.03,.4,.18],rot:[Math.PI,0,0],color:`#ffffff`},4),cf(t,1,a,.42,[.12,.34,0],`#3a2850`,`#6e4f94`),cf(t,-1,o,.42,[-.12,.34,0],`#3a2850`,`#6e4f94`),t.build(.7)}function uf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`body`,n,[0,.35,0]),i=t.addBone(`head`,r,[0,.62,.04]),a=t.addBone(`wingL`,r,[.15,.55,-.08]),o=t.addBone(`wingR`,r,[-.15,.55,-.08]),s=t.addBone(`armL`,r,[.2,.5,.05]),c=t.addBone(`armR`,r,[-.2,.5,.05]),l=`#7d8796`,u=`#5b6472`;t.bone=r,t.blob(.38,.42,.32,{at:[0,.42,0],color:l},10),t.blob(.26,.2,.24,{at:[0,.22,.02],color:u},8),t.torus(.15,.03,{at:[0,.58,.02],rot:[Math.PI/2,0,0],color:e.main},12),t.cone(.05,.3,{at:[0,.2,-.22],rot:[-2.2,0,0],color:u},5);for(let[e,n]of[[s,1],[c,-1]])t.capsule(.05,.15,{at:[n*.24,.4,.08],rot:[.5,0,n*.3],color:l,bone:e},6),t.sphere(.06,{at:[n*.27,.3,.15],color:u,bone:e},6);t.bone=i,t.sphere(.19,{at:[0,.75,.06],color:l},12),t.blob(.2,.12,.16,{at:[0,.68,.2],color:u},8);for(let e of[1,-1])t.cone(.05,.22,{at:[e*.12,.92,0],rot:[-.4,0,-e*.4],color:`#d8d0bc`},5),t.sphere(.045,{at:[e*.08,.78,.22],scale:[1.2,.8,.6],color:`#7ff0ff`},6);return cf(t,1,a,.5,[.15,.55,-.08],u,`#9aa4b2`),cf(t,-1,o,.5,[-.15,.55,-.08],u,`#9aa4b2`),t.build(.95)}function df(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`body`,n,[0,.45,0]),i=t.addBone(`head`,r,[0,.72,.32]),a=t.addBone(`wingL`,r,[.24,.7,-.05]),o=t.addBone(`wingR`,r,[-.24,.7,-.05]),s=t.addBone(`tail`,r,[0,.4,-.4]),c=`#d0559a`,l=`#9c3a74`,u=`#ffd98a`;t.bone=r,t.sphere(.4,{at:[0,.48,0],scale:[1,.95,1.1],color:c},14),t.blob(.5,.55,.3,{at:[0,.45,.26],color:u},10);for(let n=0;n<4;n++)t.cone(.05,.12,{at:[0,.85-n*.05,-.05-n*.12],rot:[-.6,0,0],color:e.main},5);for(let e of[1,-1])t.capsule(.07,.1,{at:[e*.2,.18,.12],color:l},6),t.capsule(.07,.1,{at:[e*.22,.18,-.15],color:l},6);t.bone=s,t.cone(.14,.55,{at:[0,.35,-.65],rot:[-1.9,0,0],color:c},8),t.cone(.07,.12,{at:[0,.27,-.9],rot:[-1.2,0,0],color:e.main},4),t.bone=i,t.sphere(.3,{at:[0,.82,.42],color:c},14),t.blob(.34,.2,.3,{at:[0,.72,.62],color:c},10),t.blob(.26,.08,.24,{at:[0,.65,.62],color:u},8);for(let e of[1,-1])t.cone(.06,.22,{at:[e*.15,1.08,.3],rot:[-.5,0,-e*.25],color:`#fff2c8`},6),t.sphere(.075,{at:[e*.13,.9,.66],scale:[.9,1.15,.6],color:`#1b1b22`},8),t.sphere(.028,{at:[e*.13+.02,.93,.7],color:`#ffffff`},5),t.sphere(.025,{at:[e*.07,.76,.86],color:l},5);return cf(t,1,a,.55,[.24,.7,-.05],l,`#f08cc0`),cf(t,-1,o,.55,[-.24,.7,-.05],l,`#f08cc0`),t.build(1.15)}function ff(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`body`,n,[0,.7,0]),i=t.addBone(`prop`,r,[0,1,-.95]),a=t.addBone(`bay`,r,[0,.4,.1]);t.bone=r,t.sphere(.5,{at:[0,1,0],scale:[1,.9,1.7],color:`#c9b48e`},18);for(let n of[-.22,0,.22])t.sphere(.5,{at:[n,1.02,0],scale:[.16,.92,1.71],color:n===0?e.main:e.light},14);t.sphere(.13,{at:[0,1,.85],color:`#f2b233`},10);for(let[n,r]of[[1,0],[-1,0],[0,1]])t.box(r?.06:.5,r?.5:.06,.45,{at:[n*.38,1+r*.38,-.8],color:e.dark});for(let e of[1,-1])t.cyl(.015,.015,.4,{at:[e*.18,.62,.1],rot:[0,0,e*.2],color:`#4a3a2a`},4);t.bone=a,t.blob(.5,.24,.62,{at:[0,.42,.12],color:`#8a5a2e`},10),t.torus(.27,.035,{at:[0,.52,.12],rot:[Math.PI/2,0,0],scale:[1,1.3,1],color:`#5a3a1e`},14),t.sphere(.15,{at:[0,.66,.32],color:`#7cbf4a`},10);for(let e of[1,-1])t.cone(.04,.15,{at:[e*.16,.7,.3],rot:[0,0,-e*1.3],color:`#7cbf4a`},5);for(let e of[1,-1])t.sphere(.045,{at:[e*.06,.7,.45],color:`#c9a24a`},6);return t.sphere(.15,{at:[0,.24,0],color:`#2a2c33`},10),t.sphere(.03,{at:[0,.4,0],color:`#ffd36b`},6),t.bone=i,t.box(.55,.07,.03,{at:[0,1,-1],color:`#7a5230`}),t.box(.07,.55,.03,{at:[0,1,-1],color:`#7a5230`}),t.sphere(.06,{at:[0,1,-1],color:`#c9a24a`},6),t.build(1.4)}function pf(e,t,n){let r=e.boneIndex(`root`),i=t.height*.45,a=e.addBone(`body`,r,[0,i+.1,0]),o=e.addBone(`mhead`,a,[0,i+t.height*.45,t.len*.48]),s=e.addBone(`tail`,a,[0,i+t.height*.3,-t.len*.48]),c=[e.addBone(`legFL`,a,[.17,i,t.len*.32]),e.addBone(`legFR`,a,[-.17,i,t.len*.32]),e.addBone(`legBL`,a,[.17,i,-t.len*.32]),e.addBone(`legBR`,a,[-.17,i,-t.len*.32])],l=i+t.height*.22;e.bone=a,e.blob(t.height*.62,t.height*.55,t.len,{at:[0,l,0],color:t.color},12),e.blob(t.height*.5,t.height*.3,t.len*.8,{at:[0,l-t.height*.14,.02],color:t.color2},10),t.kind===`wolf`&&e.blob(t.height*.42,t.height*.2,t.len*.85,{at:[0,l+t.height*.2,-.05],color:t.mane},10),e.blob(t.height*.68,t.height*.2,t.len*.45,{at:[0,l+t.height*.2,-.02],color:n.main},10);for(let n of[1,-1])e.box(.02,t.height*.08,t.len*.4,{at:[n*t.height*.33,l+t.height*.1,-.02],color:`#d9b04a`});for(let n=0;n<c.length;n++){let r=n%2==0?1:-1,a=n<2?t.len*.32:-t.len*.32;e.capsule(.07,i*.75,{at:[r*.17,i*.5,a],color:t.color,bone:c[n]},6),e.blob(.13,.08,.16,{at:[r*.17,.04,a+.02],color:t.kind===`horse`?`#3a2a1e`:t.color2,bone:c[n]},6)}e.bone=s,t.kind===`wolf`?(e.blob(.2,.2,.55,{at:[0,i+t.height*.42,-t.len*.72],rot:[.75,0,0],color:t.color},10),e.blob(.13,.13,.22,{at:[0,i+t.height*.68,-t.len*.86],rot:[.9,0,0],color:t.color2},8)):e.blob(.12,.45,.14,{at:[0,i+t.height*.12,-t.len*.58],rot:[-.3,0,0],color:t.mane},8),e.bone=o;let u=t.len*.55,d=i+t.height*.55;if(t.kind===`wolf`){e.blob(.42,.34,.3,{at:[0,d-.1,u-.18],color:t.color2},12),e.sphere(.22,{at:[0,d,u],color:t.color},14),e.blob(.19,.13,.32,{at:[0,d-.04,u+.22],color:t.color2},12),e.blob(.15,.06,.24,{at:[0,d-.14,u+.2],rot:[.25,0,0],color:Id(t.color2,-.1)},10),e.blob(.13,.04,.2,{at:[0,d-.1,u+.21],color:`#7a2a2a`},8);for(let t of[1,-1])e.cone(.022,.07,{at:[t*.06,d-.08,u+.3],rot:[Math.PI,0,0],color:`#f4f1e8`},4);e.sphere(.055,{at:[0,d+0,u+.39],color:`#1b1b22`},8);for(let n of[1,-1])e.cone(.085,.24,{at:[n*.11,d+.24,u-.04],rot:[-.15,0,-n*.25],color:t.color},5),e.cone(.045,.14,{at:[n*.11,d+.22,u-0],rot:[-.15,0,-n*.25],color:`#d9a0a0`},5),e.sphere(.04,{at:[n*.085,d+.06,u+.18],color:`#ffd23a`},8),e.sphere(.018,{at:[n*.087,d+.06,u+.21],color:`#1b1b22`},6),e.box(.08,.025,.03,{at:[n*.085,d+.11,u+.19],rot:[0,0,n*.35],color:Id(t.color,-.35)});e.torus(.17,.04,{at:[0,d-.13,u-.1],rot:[Math.PI/2-.3,0,0],color:n.main},14),e.sphere(.035,{at:[0,d-.2,u+.06],color:`#d9b04a`},6)}else{e.blob(.18,.4,.2,{at:[0,d-.05,u-.08],rot:[.5,0,0],color:t.color},10),e.blob(.2,.2,.42,{at:[0,d+.1,u+.12],rot:[.35,0,0],color:t.color},10),e.blob(.06,.32,.3,{at:[0,d+.12,u-.12],rot:[.5,0,0],color:t.mane},6);for(let n of[1,-1])e.cone(.04,.12,{at:[n*.07,d+.3,u+.02],color:t.color},4),e.sphere(.03,{at:[n*.09,d+.15,u+.18],color:`#1b1b22`},6);e.blob(.22,.1,.14,{at:[0,d+.12,u+.08],color:n.main},8)}return{body:a,saddleY:l+t.height*.25}}function mf(e){let t=new wd;t.addBone(`root`,-1,[0,0,0]);let{body:n,saddleY:r}=pf(t,{len:1.1,height:.62,color:`#7d7066`,color2:`#d8c8b2`,mane:`#4a4038`,kind:`wolf`},e);return kd(t,{height:.92,skin:`#7cbf4a`,ears:`pointy`,nose:`long`,face:`angry`,torso:`#7a5230`,torso2:`#3a2a1e`,legs:`#5a3a1e`,boots:`#3a2a1e`,hat:`band`,hatColor2:e.main,weapon:`mace`,pads:!0},e,n,[0,r-.12,-.05],!0),t.build(1.3)}function hf(e){let t=new wd;t.addBone(`root`,-1,[0,0,0]);let{body:n,saddleY:r}=pf(t,{len:1.25,height:.75,color:`#7a4a2a`,color2:`#5c3820`,mane:`#2a1a10`,kind:`horse`},e);return kd(t,{height:.95,skin:`#f2c9a0`,face:`dot`,torso:`#c9d1dc`,torso2:`#f2b233`,legs:`#8a96a6`,boots:`#5a6472`,hands:`#c9d1dc`,hat:`helmet`,hatColor:`#d6dde6`,plume:!0,weapon:`lance`,offhand:`buckler`,pads:!0,metal:.6},e,n,[0,r-.15,-.08],!0),t.build(1.75)}var gf=`#b9b4aa`,_f=`#8f8a80`,vf=`#d6d1c6`,yf=`#8a5a2e`,bf=`#5a3a1e`,xf=`#5d636e`;function Sf(e,t,n,r,i,a,o){e.capsule(.04,r*.8,{at:[i[0]+t*r*.45,i[1]+.06,i[2]],rot:[0,0,t*1.35],color:a,bone:n},5),e.blob(r,.06,r*.62,{at:[i[0]+t*r*.5,i[1],i[2]-r*.12],rot:[0,t*.25,0],color:o,bone:n},8),e.cone(.035,.12,{at:[i[0]+t*r*.92,i[1]+.14,i[2]],rot:[0,0,-t*.4],color:`#d8d0bc`,bone:n},4)}function Cf(e){let t=1.22,n=new wd,r=n.addBone(`root`,-1,[0,0,0]),i=n.addBone(`body`,r,[0,.35*t,0]),a=n.addBone(`head`,i,[0,.64*t,.04*t]),o=n.addBone(`wingL`,i,[.17*t,.56*t,-.08*t]),s=n.addBone(`wingR`,i,[-.17*t,.56*t,-.08*t]),c=n.addBone(`armL`,i,[.22*t,.5*t,.05*t]),l=n.addBone(`armR`,i,[-.22*t,.5*t,.05*t]),u=`#5f6776`,d=`#454c59`,f=`#9aa3b0`;n.bone=i,n.blob(.42*t,.46*t,.36*t,{at:[0,.42*t,0],color:u},12),n.blob(.28*t,.22*t,.26*t,{at:[0,.2*t,.02*t],color:d},8),n.blob(.34*t,.3*t,.12*t,{at:[0,.48*t,.14*t],color:f,shine:.85},10),n.torus(.17*t,.035*t,{at:[0,.3*t,.02*t],rot:[Math.PI/2,0,0],color:e.main},12),n.cone(.06*t,.34*t,{at:[0,.18*t,-.24*t],rot:[-2.2,0,0],color:d},5);for(let[r,i]of[[c,1],[l,-1]])n.capsule(.06*t,.16*t,{at:[i*.27*t,.4*t,.08*t],rot:[.5,0,i*.3],color:u,bone:r},6),n.sphere(.075*t,{at:[i*.3*t,.29*t,.16*t],color:d,bone:r},6),n.sphere(.1*t,{at:[i*.24*t,.56*t,.02*t],scale:[1.1,.7,1],color:e.main,bone:r,shine:.45},8);n.bone=a,n.sphere(.2*t,{at:[0,.78*t,.06*t],color:u},12),n.blob(.21*t,.12*t,.17*t,{at:[0,.7*t,.21*t],color:d},8),n.shell(.215*t,{at:[0,.8*t,.04*t],rot:[-.5,0,0],color:f,shine:.85},Math.PI*.5),n.box(.04*t,.12*t,.3*t,{at:[0,1*t,0],color:e.main});for(let e of[1,-1])n.cone(.055*t,.24*t,{at:[e*.15*t,.94*t,-.02*t],rot:[-.3,0,-e*.7],color:`#d8d0bc`},5),n.sphere(.045*t,{at:[e*.08*t,.8*t,.24*t],scale:[1.3,.7,.6],color:`#ffb347`},6);return Sf(n,1,o,.58*t,[.17*t,.56*t,-.08*t],d,`#7a8292`),Sf(n,-1,s,.58*t,[-.17*t,.56*t,-.08*t],d,`#7a8292`),n.build(1.15)}var wf=e=>({height:.98,build:1.15,skin:`#e8b07a`,face:`angry`,beard:{color:`#8a4a2a`,size:.85},hair:{style:`tuft`,color:`#8a4a2a`},hat:`band`,hatColor2:e.main,torso:`#7a5230`,torso2:`#3a2a1e`,arms:`#e8b07a`,legs:`#6b5a40`,boots:`#4a3a2a`,bracers:`#5a3a1e`});function Tf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`body`,n,[0,.42,0]);t.addBone(`mhead`,r,[0,.42,.75]),t.addBone(`tail`,r,[0,.42,-.75]);let i=.4;t.bone=r,t.cyl(.17,.19,1.45,{at:[0,i,-.05],rot:[Math.PI/2,0,0],color:`#7a5230`},12);for(let e of[-.55,-.15,.3])t.torus(.185,.02,{at:[0,i,e],color:`#5e3e22`},14);for(let e of[-.38,.12])t.torus(.2,.03,{at:[0,i,e],color:`#3a2a1e`},14);t.cyl(.19,.17,.06,{at:[0,i,-.79],rot:[Math.PI/2,0,0],color:`#c9a070`},12),t.cyl(.22,.2,.26,{at:[0,i,.72],rot:[Math.PI/2,0,0],color:xf,shine:.8},12),t.sphere(.2,{at:[0,.42000000000000004,.88],scale:[1,.95,.85],color:`#7d8794`,shine:.85},12),t.cone(.09,.14,{at:[0,.38,1.02],rot:[Math.PI/2,0,0],color:`#7d8794`,shine:.85},8);for(let e of[1,-1])t.torus(.1,.035,{at:[e*.19,.48000000000000004,.82],rot:[0,Math.PI/2,0],color:`#b87333`,shine:.85},12,Math.PI*1.5),t.sphere(.03,{at:[e*.09,.48000000000000004,1.02],color:`#ffd36b`,shine:1},6);return t.torus(.23,.04,{at:[0,i,.58],color:e.main},14),[[.48,.22,`legFL`,`legBL`],[-.48,-.32,`legFR`,`legBR`]].forEach(([n,i,a,o],s)=>{let c=t.bones.length;kd(t,wf(e),e,r,[n,0,i]);for(let e=c;e<t.bones.length;e++){let n=t.bones[e].name;t.bones[e].name=n===`legL`?a:n===`legR`?o:`${n}${s+1}`}}),t.build(1.05)}function Ef(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`crystal`,n,[.36,1.78,-.22]);t.bone=n,t.cyl(.86,.95,.22,{at:[0,.11,0],color:_f},12),t.cyl(.7,.78,.78,{at:[0,.6,0],color:gf},12);for(let e=0;e<10;e++){let n=e/10*Math.PI*2;t.box(.26,.12,.06,{at:[Math.cos(n)*.74,.36+e%2*.28,Math.sin(n)*.74],rot:[0,-n+Math.PI/2,0],color:e%3?vf:_f})}return t.cyl(.78,.78,.08,{at:[0,1.02,0],color:bf},12),t.cone(.84,.66,{at:[0,1.38,0],color:e.main},12),t.cone(.42,.32,{at:[0,1.62,0],color:Id(e.main,.18)},12),t.torus(.8,.04,{at:[0,1.06,0],rot:[Math.PI/2,0,0],color:`#d9b04a`,shine:.8},16),t.box(.44,.52,.08,{at:[0,.48,.74],color:`#2a1a12`}),t.cyl(.22,.22,.08,{at:[0,.74,.74],rot:[Math.PI/2,0,0],color:`#2a1a12`},12),t.box(.32,.4,.04,{at:[0,.46,.77],color:`#ff8a2a`}),t.sphere(.13,{at:[0,.5,.79],scale:[1,1.2,.5],color:`#ffd36b`},8),t.box(.5,.06,.14,{at:[0,.2,.8],color:vf}),t.box(.26,.55,.26,{at:[.36,1.48,-.22],color:_f}),t.box(.32,.06,.32,{at:[.36,1.77,-.22],color:vf}),t.bone=r,t.cone(.15,.42,{at:[.36,1.98,-.22],color:`#ff9a3a`},7),t.cone(.08,.26,{at:[.36,1.95,-.15],color:`#ffe68a`},6),t.build(1.9)}function Df(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=t.addBone(`turret`,n,[0,1.05,0]),i=t.addBone(`barrel`,r,[0,1.3,.05]);t.bone=n,t.cyl(.86,.95,.24,{at:[0,.12,0],color:_f},10),t.cyl(.7,.8,.78,{at:[0,.63,0],color:gf},10);for(let e=0;e<8;e++){let n=e/8*Math.PI*2+Math.PI/8;t.box(.24,.2,.18,{at:[Math.cos(n)*.72,1.1,Math.sin(n)*.72],rot:[0,-n+Math.PI/2,0],color:vf})}t.torus(.76,.05,{at:[0,.86,0],rot:[Math.PI/2,0,0],color:e.main},16);for(let[e,n]of[[.42,-.42],[.55,-.22],[.3,-.56]])t.sphere(.12,{at:[e,1.12,n],color:`#2a2c33`,shine:.5},8);t.bone=r,t.cyl(.44,.5,.16,{at:[0,1.06,0],color:bf},12),t.box(.56,.24,.46,{at:[0,1.24,-.06],color:yf});for(let e of[1,-1])t.cyl(.13,.13,.06,{at:[e*.3,1.22,.02],rot:[0,0,Math.PI/2],color:`#3a2a1e`},10);return t.bone=i,t.cyl(.21,.26,.56,{at:[0,1.48,.17],rot:[.75,0,0],color:`#3a3d44`,shine:.65},12),t.torus(.22,.045,{at:[0,1.68,.36],rot:[-.82,0,0],color:`#b87333`,shine:.85},12),t.sphere(.24,{at:[0,1.32,0],color:`#33363c`,shine:.6},10),t.build(1.75)}var Of=`#f2c9a0`,kf=`#6b6f78`,Af=`#7cbf4a`,jf=`#efe8d8`,Mf={knight:()=>({height:1.3,build:1.1,skin:Of,face:`dot`,hat:`helmet`,hatColor:`#c9d1dc`,plume:!0,torso:`#9aa6b5`,torso2:`#6b4426`,legs:`#5a5f6b`,boots:`#3a3f4a`,arms:`#9aa6b5`,hands:`#c9d1dc`,pads:!0,cape:!0,tabard:!0,weapon:`sword`,offhand:`shield`,metal:.55}),archer:()=>({height:1.1,skin:Of,face:`dot`,hair:{style:`bob`,color:`#d9894a`},hat:`hood`,hatColor:`#3f7a4a`,torso:`#4f8a5a`,torso2:`#7a5230`,legs:`#5a4a3a`,boots:`#4a3a2a`,sash:!0,offhand:`bow`}),giant:e=>({height:2.15,build:1.3,headScale:.62,torsoScale:1.3,legScale:1.15,skin:`#e0a878`,face:`angry`,nose:`ball`,ears:`round`,beard:{color:`#6a4228`,size:1.5},mustache:`#5a3620`,hair:{style:`tuft`,color:`#6a4228`},torso:`#8a6a4a`,torso2:e.main,legs:`#6b5a40`,boots:`#4a3a2a`,arms:`#e0a878`,hands:`#e0a878`,belly:!0,strap:`#5a3a1e`,bracers:`#6b4a2a`}),goblin:()=>({height:.85,skin:Af,ears:`pointy`,nose:`long`,face:`angry`,torso:`#8a6a3a`,torso2:`#5a3a1e`,legs:`#5a4a2a`,boots:`#3a2a1e`,hat:`band`,weapon:`cleaver`}),spear_goblin:()=>({height:.85,skin:Af,ears:`pointy`,nose:`long`,face:`dot`,torso:`#6e5a3a`,torso2:`#3a2a1e`,legs:`#5a4a2a`,boots:`#3a2a1e`,hat:`bandana`,weapon:`spear`}),skeleton:()=>({height:.95,skin:jf,face:`skull`,bones:!0,torso:`#e6dfcc`,legs:`#e6dfcc`,boots:`#d9d2c0`,hands:jf,scarf:!0,weapon:`sword`}),musketeer:()=>({height:1.2,skin:Of,face:`dot`,mustache:`#5a3a1e`,hair:{style:`bob`,color:`#5a3a1e`},hat:`cap`,hatColor:`#3a3f5a`,torso:`#7a5a3a`,apron:`#6a4a2a`,torso2:`#3a2a1e`,legs:`#4a4a5a`,boots:`#2a2a33`,sash:!0,weapon:`musket`}),wizard:()=>({height:1.25,skin:Of,face:`dot`,beard:{color:`#f4f1e8`,size:1.1},mustache:`#f4f1e8`,hat:`wizard`,hatColor:`#a8322a`,hatColor2:`#f2b233`,torso:`#c4432f`,apron:`#a8322a`,robe:!0,legs:`#a8322a`,boots:`#5a2a1e`,sash:!0,weapon:`staff`}),iron_swordsman:()=>({height:1.2,build:1.15,skin:`#3a3f4a`,face:`visor`,eyeColor:`#ffb347`,hat:`iron`,hatColor:`#7d8ca3`,torso:`#7d8ca3`,torso2:`#3a3f4a`,legs:`#5d6b80`,boots:`#3a3f4a`,arms:`#7d8ca3`,hands:`#5d6b80`,pads:!0,weapon:`greatsword`,metal:.75}),axe_dwarf:()=>({height:1.05,build:1.4,skin:Of,face:`angry`,beard:{color:`#d9692a`,size:1.3},mustache:`#c45a1e`,hat:`winged`,hatColor:`#b8bec8`,torso:`#8a5a3a`,torso2:`#3a2a1e`,legs:`#5a4a3a`,boots:`#3a2a1e`,arms:Of,pads:!0,weapon:`axe2`,belly:!0,bracers:`#6b6f78`}),bomber:()=>({height:.9,build:1.05,skin:`#e8b890`,face:`dot`,nose:`long`,beard:{color:`#f4f1e8`,size:.7},hat:`goggles`,torso:`#d9822a`,torso2:`#3a2a1e`,legs:`#5a4a3a`,boots:`#3a2a1e`,sash:!0,weapon:`bomb`}),barbarian:()=>({height:1.25,build:1.15,skin:`#e8b07a`,face:`angry`,hair:{style:`braids`,color:`#c9a24a`},beard:{color:`#c9a24a`},hat:`horned`,hatColor:`#8a8f99`,torso:`#7a5230`,arms:`#e8b07a`,torso2:`#3a2a1e`,legs:`#6b5a40`,boots:`#4a3a2a`,weapon:`club`,bracers:`#5a3a1e`}),witch:()=>({height:1.2,skin:`#cfe0c0`,face:`dot`,eyeColor:`#5a1f7a`,hair:{style:`long`,color:`#2a1a3a`},hat:`witch`,hatColor:`#4a2a6a`,torso:`#5a3a7a`,robe:!0,apron:`#4a2a6a`,legs:`#3a2a4a`,boots:`#2a1a2a`,weapon:`skullstaff`,cape:!0}),tunneler:()=>({height:1.15,build:1.18,skin:Of,face:`dot`,nose:`ball`,beard:{color:`#7a4a2a`,size:.75},mustache:`#6b3f22`,hat:`hardhat`,hatColor:`#e8b830`,torso:`#7a6a52`,torso2:`#3a2a1e`,legs:`#4a5f7a`,boots:`#3a2a1e`,arms:`#7a6a52`,hands:`#8a6a4a`,strap:`#5a3a1e`,bracers:`#5a4a3a`,weapon:`pickaxe`,scarf:!0}),siege_giant:e=>({height:2.1,build:1.3,headScale:.62,torsoScale:1.25,legScale:1.15,skin:`#d99f78`,face:`angry`,nose:`ball`,ears:`round`,mustache:`#4a2e1e`,hair:{style:`mohawk`,color:`#4a2e1e`},torso:`#6a7484`,torso2:`#3a2a1e`,tabard:!0,legs:`#5a5148`,boots:`#3a2e26`,arms:`#d99f78`,hands:`#7a5a3a`,pads:!0,bracers:kf,belly:!0,weapon:`handcannon`,strap:e.dark}),berserker:()=>({height:1.25,build:1.12,skin:`#e8b07a`,face:`angry`,hair:{style:`mohawk`,color:`#c4532a`},beard:{color:`#c4532a`,size:.85},torso:`#5a3a24`,torso2:`#3a2a1e`,arms:`#e8b07a`,legs:`#4a3a2a`,boots:`#3a2a1e`,bracers:kf,pads:!0,strap:`#3a2a1e`,weapon:`handaxe`,offhand:`handaxe`}),blowgun_goblin:()=>({height:.85,skin:`#8ac45a`,ears:`pointy`,nose:`long`,face:`dot`,eyeColor:`#2a1d10`,hat:`hood`,hatColor:`#4a6a32`,torso:`#6a4a2a`,torso2:`#3a2a1e`,legs:`#4a3a24`,boots:`#3a2a1e`,strap:`#5a3a1e`,weapon:`blowpipe`}),giant_skeleton:()=>({height:2,build:1.25,headScale:.8,torsoScale:1.15,skin:jf,face:`skull`,bones:!0,torso:`#e6dfcc`,legs:`#e6dfcc`,boots:`#d9d2c0`,hands:jf,scarf:!0})},Nf={knight:{rig:`biped`,attack:`swing`},archer:{rig:`biped`,attack:`bow`},giant:{rig:`biped`,attack:`punch`,stride:.8,cadence:.6},goblin:{rig:`biped`,attack:`swing`,cadence:1.5},spear_goblin:{rig:`biped`,attack:`throw`,cadence:1.5},skeleton:{rig:`biped`,attack:`swing`,cadence:1.3},musketeer:{rig:`biped`,attack:`shoot`},wizard:{rig:`biped`,attack:`cast`},iron_swordsman:{rig:`biped`,attack:`chop`,cadence:1.3},axe_dwarf:{rig:`biped`,attack:`spin`},bomber:{rig:`biped`,attack:`throw`},barbarian:{rig:`biped`,attack:`chop`},witch:{rig:`biped`,attack:`cast`},giant_skeleton:{rig:`biped`,attack:`punch`,stride:.8,cadence:.7},golem:{rig:`biped`,attack:`slam`,stride:.6,cadence:.5},golemite:{rig:`biped`,attack:`slam`,stride:.7,cadence:.7},ice_spirit:{rig:`blob`,attack:`hop`},fire_spirit:{rig:`blob`,attack:`hop`},bat:{rig:`flyer`,attack:`bite`,hover:1},gargoyle:{rig:`flyer`,attack:`spit`,hover:.9},baby_dragon:{rig:`flyer`,attack:`breath`,hover:1.4},bomb_blimp:{rig:`blimp`,attack:`drop`,hover:1.3},wolf_rider:{rig:`mount`,attack:`swing`,cadence:1.6},lancer:{rig:`mount`,attack:`stab`,cadence:1.1},cannon:{rig:`cannon`,attack:`fire`},inferno:{rig:`inferno`,attack:`beam`},tombstone:{rig:`tomb`,attack:`none`},tunneler:{rig:`biped`,attack:`chop`,cadence:1.2},elixir_collector:{rig:`inferno`,attack:`none`},mega_gargoyle:{rig:`flyer`,attack:`spit`,hover:1},siege_ram:{rig:`mount`,attack:`none`,cadence:1.2},siege_giant:{rig:`biped`,attack:`shoot`,stride:.8,cadence:.6},berserker:{rig:`biped`,attack:`chop`,cadence:1.4},blowgun_goblin:{rig:`biped`,attack:`shoot`,cadence:1.6},spirit_hut:{rig:`inferno`,attack:`none`},bomb_turret:{rig:`cannon`,attack:`fire`},princess:{rig:`princess`,attack:`bow`},king:{rig:`king`,attack:`fire`}};function Pf(e){let t=new wd,n=t.addBone(`root`,-1,[0,0,0]),r=kd(t,Mf.giant_skeleton(e),e,n);return t.sphere(.42,{at:[0,1.05,-.42],color:`#2a2c33`,bone:r.spine},14),t.torus(.43,.04,{at:[0,1.05,-.42],rot:[0,0,0],color:`#6b4426`,bone:r.spine},16),t.torus(.43,.04,{at:[0,1.05,-.42],rot:[0,Math.PI/2,0],color:`#6b4426`,bone:r.spine},16),t.cyl(.04,.04,.22,{at:[0,1.52,-.42],color:`#c9a24a`,bone:r.spine},6),t.sphere(.07,{at:[0,1.65,-.42],color:`#ffb347`,bone:r.spine},8),t.box(.08,.7,.08,{at:[.22,1.05,-.1],rot:[.4,0,0],color:e.main,bone:r.spine}),t.box(.08,.7,.08,{at:[-.22,1.05,-.1],rot:[.4,0,0],color:e.main,bone:r.spine}),t.build(2)}function Ff(e,t){let n=bd[t];switch(e){case`giant_skeleton`:return Pf(n);case`golem`:return of(n,!1);case`golemite`:return of(n,!0);case`ice_spirit`:return sf(n,`ice`);case`fire_spirit`:return sf(n,`fire`);case`bat`:return lf(n);case`gargoyle`:return uf(n);case`baby_dragon`:return df(n);case`bomb_blimp`:return ff(n);case`wolf_rider`:return mf(n);case`lancer`:return hf(n);case`cannon`:return Ud(n);case`inferno`:return Wd(n);case`tombstone`:return Gd(n);case`elixir_collector`:return Kd(n);case`mega_gargoyle`:return Cf(n);case`siege_ram`:return Tf(n);case`spirit_hut`:return Ef(n);case`bomb_turret`:return Df(n);case`princess`:return tf(n);case`king`:return rf(n);case`rubble-princess`:return af(3);case`rubble-king`:return af(4);default:return Ld((Mf[e]??Mf.knight)(n),n)}}var If=new Map;function Lf(e,t){let n=`${e}|${t}`,r=If.get(n);return r||(r=Ff(e,t),r.geometry.userData.shared=!0,If.set(n,r)),r}function Rf(e){return Nf[e]??{rig:`biped`,attack:`swing`}}var zf=`
attribute float aSize;
attribute float aAlpha;
attribute float aSpin;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying float vSpin;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vSpin = aSpin;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale;
}`,Bf=`
uniform float uLeaf;
varying float vAlpha;
varying float vSpin;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float c = cos(vSpin);
  float s = sin(vSpin);
  d = vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  // 落葉是旋轉的細長橢圓；其他是偏白的亮心＋半透明光暈（明亮的草地上也看得到）
  vec3 col = vColor;
  float a;
  if (uLeaf > 0.5) {
    a = smoothstep(0.5, 0.4, length(d * vec2(1.0, 2.3)));
  } else {
    float r = length(d);
    float core = smoothstep(0.24, 0.06, r);
    a = max(core, smoothstep(0.5, 0.14, r) * 0.42);
    col = mix(vColor, vec3(1.0), core * 0.5);
  }
  a *= vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`,Vf=48,Hf=9,Uf=16;function Wf(e,t=.5){return e()<t?[(e()-.5)*2*Hf,(e()-.5)*2*Uf]:e()<.7?[(e()<.5?-1:1)*(8.4+e()*1.8),(e()-.5)*2*Uf]:[(e()-.5)*2*Hf,-16-e()*2]}var Gf=e=>Math.min(1,e.age/.6,(e.life-e.age)/.8),Kf={meadow:{count:30,leaf:!1,colors:[`#fffbe0`,`#fff1a0`,`#ffffff`],size:[.26,.36],alpha:.8,spawn(e,t){[e.x,e.z]=Wf(t,.6),e.y=.4+t()*2,e.vx=(t()-.5)*.3,e.vz=(t()-.5)*.3,e.vy=0,e.life=6+t()*6},move(e,t,n){e.x+=(e.vx+Math.sin(n*.7+e.phase)*.15)*t,e.z+=e.vz*t,e.y+=Math.sin(n*1.3+e.phase)*.12*t},fade:Gf},fort:{count:36,leaf:!1,colors:[`#ffb347`,`#ff8a2a`,`#ffe08a`],size:[.26,.38],alpha:1,spawn(e,t,n){let r=n.length?n[Math.floor(t()*n.length)]:[(t()-.5)*20,1.2,-18];e.x=r[0]+(t()-.5)*.25,e.y=r[1],e.z=r[2]+(t()-.5)*.25,e.vx=(t()-.5)*.25,e.vz=(t()-.5)*.25,e.vy=.7+t()*.6,e.life=1.2+t()*1.3},move(e,t,n){e.x+=(e.vx+Math.sin(n*5+e.phase)*.2)*t,e.z+=e.vz*t,e.y+=e.vy*t,e.vy*=1-.4*t},fade:e=>Math.min(1,e.age/.15)*(1-e.age/e.life)},autumn:{count:30,leaf:!0,colors:[`#e0782e`,`#c4532a`,`#f2a63a`,`#d9692a`],size:[.5,.66],alpha:.95,spawn(e,t){[e.x,e.z]=Wf(t,.55),e.y=2.6+t()*1.6,e.vx=.15+t()*.25,e.vz=(t()-.5)*.2,e.vy=-(.35+t()*.25),e.life=9,e.spinRate=(t()<.5?-1:1)*(1.2+t()*1.8)},move(e,t,n){e.y>.03?(e.x+=(e.vx+Math.sin(n*1.6+e.phase)*.45)*t,e.z+=e.vz*t,e.y=Math.max(.03,e.y+e.vy*t),e.spin+=e.spinRate*t):e.age<e.life-1.2&&(e.age=e.life-1.2)},fade:e=>Math.min(1,e.age/.5,(e.life-e.age)/1.2)},lake:{count:30,leaf:!1,colors:[`#e6ff8a`,`#c8ff6a`,`#fff3a0`],size:[.34,.46],alpha:1,spawn(e,t){[e.x,e.z]=Wf(t,.5),t()<.35&&(e.z=(t()-.5)*4),e.y=.3+t()*1.6,e.vx=(t()-.5)*.4,e.vz=(t()-.5)*.4,e.vy=0,e.life=5+t()*5},move(e,t,n){e.x+=(e.vx+Math.sin(n*.9+e.phase*2)*.25)*t,e.z+=(e.vz+Math.cos(n*.8+e.phase)*.25)*t,e.y+=Math.sin(n*1.7+e.phase)*.18*t},fade:(e,t)=>Gf(e)*(.25+.75*Math.max(0,Math.sin(t*2.4+e.phase*3)))},highland:{count:34,leaf:!1,colors:[`#8fe8ff`,`#c99bff`,`#e8f6ff`],size:[.28,.4],alpha:1,spawn(e,t,n){if(n.length&&t()<.75){let r=n[Math.floor(t()*n.length)];e.x=r[0]+(t()-.5)*.5,e.y=r[1]*(.4+t()*.6),e.z=r[2]+(t()-.5)*.5}else[e.x,e.z]=Wf(t,.6),e.y=.3+t()*1.5;e.vx=(t()-.5)*.15,e.vz=(t()-.5)*.15,e.vy=.25+t()*.35,e.life=1.6+t()*1.6},move(e,t){e.x+=e.vx*t,e.z+=e.vz*t,e.y+=e.vy*t},fade:(e,t)=>Math.min(1,e.age/.3,(e.life-e.age)/.6)*(.5+.5*Math.sin(t*9+e.phase*5))},royal:{count:30,leaf:!1,colors:[`#ffe27a`,`#fff3c4`,`#f2c14a`],size:[.26,.36],alpha:1,spawn(e,t){[e.x,e.z]=Wf(t,.6),e.y=1.5+t()*2.5,e.vx=(t()-.5)*.2,e.vz=(t()-.5)*.2,e.vy=-(.12+t()*.15),e.life=6+t()*5},move(e,t,n){e.x+=(e.vx+Math.sin(n+e.phase)*.1)*t,e.z+=e.vz*t,e.y=Math.max(.05,e.y+e.vy*t)},fade:(e,t)=>Gf(e)*(.35+.65*Math.abs(Math.sin(t*3.2+e.phase*4)))}},qf=class{constructor(){S(this,`points`,void 0),S(this,`material`,void 0),S(this,`pos`,new Float32Array(144)),S(this,`col`,new Float32Array(144)),S(this,`size`,new Float32Array(Vf)),S(this,`alpha`,new Float32Array(Vf)),S(this,`spin`,new Float32Array(Vf)),S(this,`motes`,[]),S(this,`def`,Kf.meadow),S(this,`emitters`,[]),S(this,`seed`,1),S(this,`lastT`,-1),S(this,`enabled`,!0),S(this,`rnd`,()=>(this.seed=this.seed*16807%2147483647,this.seed/2147483647));let e=new Ki;e.setAttribute(`position`,new ji(this.pos,3)),e.setAttribute(`aColor`,new ji(this.col,3)),e.setAttribute(`aSize`,new ji(this.size,1)),e.setAttribute(`aAlpha`,new ji(this.alpha,1)),e.setAttribute(`aSpin`,new ji(this.spin,1)),this.material=new Eo({uniforms:{uScale:{value:20},uLeaf:{value:0}},vertexShader:zf,fragmentShader:Bf,transparent:!0,depthWrite:!1,blending:1}),this.points=new Za(e,this.material),this.points.frustumCulled=!1,this.points.renderOrder=4;for(let e=0;e<Vf;e++)this.motes.push({x:0,y:-5,z:0,vx:0,vy:0,vz:0,age:0,life:0,phase:0,size:0,spin:0,spinRate:0,r:1,g:1,b:1});this.setStyle(`meadow`,[])}setScale(e){this.material.uniforms.uScale.value=e}setStyle(e,t){this.def=Kf[e],this.emitters=t,this.material.uniforms.uLeaf.value=+!!this.def.leaf,this.motes.forEach((e,t)=>{t<this.def.count?(this.respawn(e),e.age=this.rnd()*e.life):e.life=0})}respawn(e){let t=this.def;e.age=0,e.phase=this.rnd()*Math.PI*2,e.spin=this.rnd()*Math.PI,e.spinRate=0,e.size=t.size[0]+this.rnd()*(t.size[1]-t.size[0]);let n=t.colors[Math.floor(this.rnd()*t.colors.length)],r=parseInt(n.slice(1),16);e.r=(r>>16&255)/255,e.g=(r>>8&255)/255,e.b=(r&255)/255,t.spawn(e,this.rnd,this.emitters)}update(e){let t=this.lastT<0?0:Math.min(.1,Math.max(0,e-this.lastT));if(this.lastT=e,this.points.visible=this.enabled,!this.enabled)return;let n=this.def;for(let r=0;r<Vf;r++){let i=this.motes[r];r>=n.count?this.alpha[r]=0:(i.age+=t,i.age>=i.life&&this.respawn(i),n.move(i,t,e),this.pos[r*3]=i.x,this.pos[r*3+1]=i.y,this.pos[r*3+2]=i.z,this.col[r*3]=i.r*i.r,this.col[r*3+1]=i.g*i.g,this.col[r*3+2]=i.b*i.b,this.size[r]=i.size,this.spin[r]=i.spin,this.alpha[r]=Math.max(0,Math.min(1,n.fade(i,e)))*n.alpha)}let r=this.points.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aColor.needsUpdate=!0,r.attributes.aSize.needsUpdate=!0,r.attributes.aAlpha.needsUpdate=!0,r.attributes.aSpin.needsUpdate=!0}},Jf=`#6b4426`;function Yf(e,t,n,r,i,a){e.cyl(.14*r,.2*r,.9*r,{at:[t,.45*r,n],color:Jf},6),e.sphere(.85*r,{at:[t,1.35*r,n],scale:[1,.9,1],color:a()<.5?i.trees[0]:i.trees[1]},9),e.sphere(.6*r,{at:[t+.25*r,1.85*r,n+.1*r],color:i.trees[2]},8)}function Xf(e,t,n,r,i){e.cyl(.1*r,.15*r,.7*r,{at:[t,.35*r,n],color:`#5a3a22`},6),e.cone(.95*r,1.1*r,{at:[t,1.1*r,n],color:i.trees[0]},8),e.cone(.74*r,.95*r,{at:[t,1.65*r,n],color:i.trees[1]},8),e.cone(.48*r,.8*r,{at:[t,2.15*r,n],color:i.trees[2]},8)}function Zf(e,t,n,r,i,a){e.cyl(.13*r,.2*r,1*r,{at:[t,.5*r,n],color:`#5e3b24`},6);for(let[o,s,c,l]of[[0,1.45,0,.72],[.48,1.3,.12,.5],[-.45,1.32,-.1,.52],[.1,1.95,.05,.5],[-.12,1.62,.42,.44]])e.sphere(l*r,{at:[t+o*r,s*r,n+c*r],color:i.trees[Math.floor(a()*3)]},8)}function Qf(e,t,n,r,i,a){e.cyl(.15*r,.24*r,1.3*r,{at:[t,.65*r,n],color:`#5a4632`},6),e.sphere(.9*r,{at:[t,1.78*r,n],scale:[1.15,.65,1.15],color:i.trees[1]},10),e.sphere(.5*r,{at:[t+.2*r,2.15*r,n],scale:[1.2,.6,1.2],color:i.trees[2]},8);for(let o=0;o<12;o++){let s=o/12*Math.PI*2+a()*.25,c=.92*r,l=(.8+a()*.35)*r;e.box(.13*r,l,.05*r,{at:[t+Math.cos(s)*c,1.65*r-l/2,n+Math.sin(s)*c],rot:[0,-s+Math.PI/2,0],color:o%2?i.trees[0]:i.trees[1]})}}function $f(e,t,n,r){let i=`#5b4a3a`;e.cyl(.1*r,.19*r,1.5*r,{at:[t,.75*r,n],color:i},5),e.cyl(.04*r,.08*r,.85*r,{at:[t+.28*r,1.45*r,n],rot:[0,0,-.85],color:i},4),e.cyl(.035*r,.07*r,.7*r,{at:[t-.24*r,1.3*r,n+.05*r],rot:[.2,0,.95],color:i},4),e.cyl(.03*r,.05*r,.5*r,{at:[t+.05*r,1.75*r,n-.15*r],rot:[-.6,0,.1],color:i},4)}function ep(e,t,n,r,i,a){e.rock(r,{at:[t,r*.4,n],scale:[1.2,.8,1],color:a()<.5?i.rock[0]:i.rock[1]})}function tp(e,t,n,r,i,a){for(let o=0;o<3;o++){let s=a()*Math.PI*2,c=(.9+a()*.8)*r;e.cone(.32*r,c,{at:[t+Math.cos(s)*.3*r,c/2-.05,n+Math.sin(s)*.3*r],rot:[Math.sin(s)*.25,0,-Math.cos(s)*.25],color:o%2?i.rock[0]:i.rock[1]},5)}}function np(e,t,n,r,i,a){e.sphere(r,{at:[t,r*.5,n],scale:[1.3,.8,1.1],color:`#5aa046`},8),e.sphere(r*.18,{at:[t+r*.4,r*.85,n+r*.3],color:a()<.5?`#ffd36b`:i.accent},5),e.sphere(r*.15,{at:[t-r*.35,r*.8,n+r*.25],color:`#ffffff`},5)}function rp(e,t,n,r,i){e.cyl(.42*r,.42*r,.75*r,{at:[t,.42*r,n],rot:[0,i,Math.PI/2],color:`#e2c25a`},12);for(let a of[-.2,.2])e.cyl(.435*r,.435*r,.05*r,{at:[t+Math.cos(i)*a*r,.42*r,n-Math.sin(i)*a*r],rot:[0,i,Math.PI/2],color:`#a8862e`},12)}function ip(e,t,n,r){e.sphere(.32*r,{at:[t,.26*r,n],scale:[1.25,.85,1.25],color:`#f08a24`},10),e.sphere(.22*r,{at:[t,.3*r,n],scale:[1.6,.95,.6],color:`#e07818`},8),e.cyl(.04*r,.05*r,.18*r,{at:[t,.56*r,n],rot:[.2,0,.15],color:`#4f6a2a`},5),e.sphere(.1*r,{at:[t+.12*r,.52*r,n],scale:[1.4,.35,1],color:`#5f8a32`},6)}function ap(e,t,n,r,i){e.cyl(.05*i,.065*i,1.55*i,{at:[n,.78*i,r],color:`#3e3328`},5),e.box(.46*i,.05*i,.06*i,{at:[n+.18*i,1.5*i,r],color:`#3e3328`}),e.box(.24*i,.06*i,.24*i,{at:[n+.36*i,1.4*i,r],color:`#2e2620`}),e.cone(.17*i,.14*i,{at:[n+.36*i,1.49*i,r],color:`#2e2620`},4),t.box(.17*i,.24*i,.17*i,{at:[n+.36*i,1.24*i,r],color:`#ffd27a`}),e.box(.22*i,.04*i,.22*i,{at:[n+.36*i,1.1*i,r],color:`#2e2620`})}function op(e,t,n,r,i,a,o){e.rock(.38*i,{at:[n,.06*i,r],scale:[1.4,.5,1.2],color:`#6f6a60`});let s=3+Math.floor(o()*2);for(let e=0;e<s;e++){let s=o()*Math.PI*2,c=e===0?0:.26*i,l=(e===0?1.15:.55+o()*.4)*i,u=e===0?0:.38;t.cone((e===0?.2:.14)*i,l,{at:[n+Math.cos(s)*c,l/2+.05,r+Math.sin(s)*c],rot:[Math.sin(s)*u,0,-Math.cos(s)*u],color:a},5)}}function sp(e,t,n,r,i){e.cyl(.17*i,.22*i,.9*i,{at:[n,.45*i,r],color:`#8a8478`},8),e.cyl(.32*i,.2*i,.22*i,{at:[n,1*i,r],color:`#4a3e34`},10),t.cone(.24*i,.5*i,{at:[n,1.33*i,r],color:`#ff9a3a`},7),t.cone(.13*i,.34*i,{at:[n,1.28*i,r+.12*i],color:`#ffe68a`},6)}function cp(e,t,n,r){e.cyl(.27*r,.2*r,.38*r,{at:[t,.19*r,n],color:`#c9773a`},10),e.cyl(.3*r,.3*r,.07*r,{at:[t,.39*r,n],color:`#e8b070`},10),e.cyl(.04*r,.045*r,.45*r,{at:[t,.62*r,n],color:`#5a3a22`},5),e.sphere(.38*r,{at:[t,1.02*r,n],color:`#3f9a4a`},10),e.sphere(.25*r,{at:[t,1.5*r,n],color:`#4aab55`},9)}function lp(e,t,n,r){e.box(.62*r,.22*r,.62*r,{at:[t,.11*r,n],color:`#e2d6ba`}),e.cyl(.18*r,.21*r,1.4*r,{at:[t,.92*r,n],color:`#f2ead6`},10);for(let i=0;i<2;i++)e.torus(.2*r,.035*r,{at:[t,(.4+i*1.02)*r,n],rot:[Math.PI/2,0,0],color:`#e6b53c`},14);e.box(.5*r,.14*r,.5*r,{at:[t,1.68*r,n],color:`#e2d6ba`}),e.sphere(.25*r,{at:[t,1.98*r,n],color:`#f2c14a`},12)}function up(e,t,n,r,i,a){e.cyl(.05*r,.05*r,2.3*r,{at:[t,1.15*r,n],color:`#6b4426`},5),e.sphere(.07*r,{at:[t,2.33*r,n],color:a},6),e.box(.66*r,.05*r,.05*r,{at:[t,2.12*r,n+.03*r],color:a}),e.box(.56*r,.75*r,.03*r,{at:[t,1.7*r,n+.05*r],color:i});for(let a of[-1,1])e.cone(.14*r,.32*r,{at:[t+a*.14*r,1.18*r,n+.05*r],rot:[0,0,Math.PI],scale:[1,1,.12],color:i},3);e.box(.56*r,.05*r,.035*r,{at:[t,1.36*r,n+.06*r],color:a})}function dp(e,t,n,r,i){for(let a=0;a<6;a++){let o=(i()-.5)*.5*r,s=(i()-.5)*.4*r,c=(.6+i()*.5)*r;e.cyl(.018*r,.03*r,c,{at:[t+o,c/2,n+s],rot:[(i()-.5)*.3,0,(i()-.5)*.3],color:a%2?`#6f8f3a`:`#5f7f32`},4),a%2==0&&e.capsule(.04*r,.14*r,{at:[t+o,c+.02,n+s],color:`#7a4f2a`},5)}}function fp(e,t,n,r,i,a){if(e.cyl(.3*i,.3*i,.03,{at:[t,n,r],color:`#4f9a4a`},12),e.box(.12*i,.035,.3*i,{at:[t+.12*i,n+.004,r+.06*i],rot:[0,.5,0],color:`#3f7f8f`}),a){for(let a=0;a<5;a++){let o=a/5*Math.PI*2;e.sphere(.07*i,{at:[t+Math.cos(o)*.06*i,n+.07,r+Math.sin(o)*.06*i],scale:[1,.6,1.6],rot:[0,-o,0],color:`#ff9ec4`},6)}e.sphere(.04*i,{at:[t,n+.1,r],color:`#ffe27a`},5)}}function pp(e,t,n,r,i,a,o,s=!0){let c=o(),l=.8+o()*.7;switch(e){case`fort`:s&&c<.5?Xf(t,r,i,l*1.05,a):c<.82?ep(t,r,i,.4+o()*.55,a,o):s?sp(t,n,r,i,.9):np(t,r,i,.3+o()*.2,a,o);return;case`autumn`:s&&c<.55?Zf(t,r,i,l,a,o):c<.75?rp(t,r,i,.9+o()*.4,o()*Math.PI):c<.9?ip(t,r,i,.9+o()*.6):ep(t,r,i,.35+o()*.3,a,o);return;case`lake`:s&&c<.45?Qf(t,r,i,l,a,o):c<.65?dp(t,r,i,1+o()*.4,o):c<.82?ap(t,n,r,i,1):ep(t,r,i,.35+o()*.4,a,o);return;case`highland`:s&&c<.3?Xf(t,r,i,l*1.1,a):s&&c<.45?$f(t,r,i,l):c<.7?tp(t,r,i,.7+o()*.6,a,o):c<.85?op(t,n,r,i,.8+o()*.5,o()<.5?`#8fe8ff`:`#c99bff`,o):ep(t,r,i,.4+o()*.5,a,o);return;case`royal`:s&&c<.4?Yf(t,r,i,l,a,o):c<.65?cp(t,r,i,.9+o()*.4):s&&c<.8?lp(t,r,i,1):np(t,r,i,.32+o()*.25,a,o);return;default:s&&c<.55?Yf(t,r,i,l,a,o):c<.8?ep(t,r,i,.4+o()*.5,a,o):np(t,r,i,.35+o()*.3,a,o)}}function mp(e,t,n,r,i,a,o,s){switch(e){case`fort`:Xf(t,r,i,a*1.15,o);return;case`autumn`:Zf(t,r,i,a*1.05,o,s);return;case`lake`:s()<.6?Qf(t,r,i,a,o,s):Yf(t,r,i,a,o,s);return;case`highland`:s()<.65?Xf(t,r,i,a*1.2,o):op(t,n,r,i,a*1.2,s()<.5?`#8fe8ff`:`#c99bff`,s);return;default:Yf(t,r,i,a,o,s)}}var hp=48,gp=[{style:`meadow`,grassA:`#8fcf5e`,grassB:`#86c656`,path:`#e5c98a`,pathLine:`rgba(150,110,60,0.45)`,base:`#c9b07a`,outside:`#3f7a35`,trees:[`#3f8f3a`,`#4a9a3e`,`#5aae48`],rock:[`#9a958a`,`#8a857a`],accent:`#ff8fb0`,wall:[`#b3a994`,`#cbc1ac`,`#9a907d`],roof:`#b8423a`,bridge:`wood`,wood:[`#a8743e`,`#9a6834`],water:[`#6fbbe7`,`#9cdaf7`],light:{sky:`#fff6e0`,ground:`#6f8f4f`,hemi:2.1,sun:`#fff1d6`,sunI:2.6,bg:`#2d4f2a`}},{style:`fort`,grassA:`#94c76c`,grassB:`#89bb62`,path:`#cfcabb`,pathLine:`rgba(95,95,100,0.45)`,base:`#b4ad9c`,outside:`#386f3a`,trees:[`#2f6b45`,`#3a7a4f`,`#4c8f5c`],rock:[`#9a978f`,`#86837c`],accent:`#ffd36b`,wall:[`#a19e97`,`#bfbcb4`,`#84817a`],roof:`#4a7a62`,bridge:`stone`,wood:[`#a8743e`,`#9a6834`],water:[`#5fa8d6`,`#8ccbea`],light:{sky:`#f4f6ff`,ground:`#6a7f5a`,hemi:2.1,sun:`#fff6e8`,sunI:2.6,bg:`#2c4a30`}},{style:`autumn`,grassA:`#b7c75c`,grassB:`#abbb52`,path:`#e6b878`,pathLine:`rgba(150,90,40,0.45)`,base:`#cf9f62`,outside:`#6f7a32`,trees:[`#c4532a`,`#e0782e`,`#f2a63a`],rock:[`#a08f78`,`#8c7c66`],accent:`#ff6b5a`,wall:[`#b89a78`,`#d2b593`,`#9a7e5f`],roof:`#8a3b22`,bridge:`wood`,wood:[`#a0603a`,`#8f5530`],water:[`#62b0d8`,`#96d2ec`],light:{sky:`#fff0d8`,ground:`#8a7a4a`,hemi:2,sun:`#ffdcaa`,sunI:2.8,bg:`#4a4a24`}},{style:`lake`,grassA:`#7fc69a`,grassB:`#74ba8f`,path:`#dcd6c0`,pathLine:`rgba(90,110,120,0.45)`,base:`#bdb9a2`,outside:`#2f6455`,trees:[`#2c6f6a`,`#36807a`,`#46958c`],rock:[`#8f9a9c`,`#7c878a`],accent:`#9ec8ff`,wall:[`#a7b2b8`,`#c5ced3`,`#8a959c`],roof:`#3b4a7a`,bridge:`wood`,wood:[`#86644a`,`#7a5a40`],water:[`#3f7fb8`,`#6fa8dc`],light:{sky:`#c8d6ff`,ground:`#3f5a62`,hemi:1.95,sun:`#e2e8ff`,sunI:2.25,bg:`#1d3346`}},{style:`highland`,grassA:`#a4bf6c`,grassB:`#98b262`,path:`#cdb48a`,pathLine:`rgba(120,95,60,0.45)`,base:`#ad976c`,outside:`#4d5f36`,trees:[`#3f5a3a`,`#4c6a42`,`#5c7c4c`],rock:[`#8a8378`,`#77706a`],accent:`#c99bff`,wall:[`#8f877a`,`#a89f90`,`#746c60`],roof:`#5b3f7a`,bridge:`wood`,wood:[`#8a7458`,`#7c684e`],water:[`#4fa9bf`,`#83cfdc`],light:{sky:`#eef0ff`,ground:`#5e5a48`,hemi:2,sun:`#f2f0ff`,sunI:2.45,bg:`#33402a`}},{style:`royal`,grassA:`#92d66c`,grassB:`#86cb61`,path:`#f1d47e`,pathLine:`rgba(170,120,30,0.5)`,base:`#e2c060`,outside:`#3a8a3a`,trees:[`#2f9a46`,`#3aab52`,`#52c062`],rock:[`#cfc6b0`,`#b9b09a`],accent:`#ff5a6a`,wall:[`#e6dcc4`,`#f6eedb`,`#cfc2a2`],roof:`#e2b23a`,bridge:`stone`,wood:[`#a8743e`,`#9a6834`],water:[`#5ec0f0`,`#a0e4ff`],light:{sky:`#fff8e6`,ground:`#7f9a4f`,hemi:2.15,sun:`#fff0cc`,sunI:2.7,bg:`#2e5a2e`}}];function _p(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function vp(e,t,n,r,i){let a=(t,n,r,i,a,o)=>{e.fillStyle=o,e.beginPath(),e.ellipse(t,n,r,i,a,0,Math.PI*2),e.fill()};if(t===`autumn`){let e=[`rgba(224,120,46,0.7)`,`rgba(196,83,42,0.65)`,`rgba(242,166,58,0.7)`];for(let t=0;t<420;t++)a(i()*n,i()*r,4+i()*3,2+i()*1.5,i()*Math.PI,e[t%3])}else if(t===`highland`){for(let e=0;e<260;e++)a(i()*n,i()*r,2+i()*3,1.5+i()*2,i()*3,i()<.5?`rgba(120,112,100,0.35)`:`rgba(170,160,140,0.35)`);for(let e=0;e<60;e++)a(i()*n,i()*r,10+i()*14,5+i()*6,i()*3,`rgba(200,180,110,0.16)`);e.strokeStyle=`rgba(90,80,60,0.22)`,e.lineWidth=1.5;for(let t=0;t<40;t++){let t=i()*n,a=i()*r;e.beginPath(),e.moveTo(t,a);for(let n=0;n<3;n++)t+=(i()-.5)*22,a+=(i()-.5)*22,e.lineTo(t,a);e.stroke()}}else if(t===`lake`)for(let e=0;e<300;e++)a(i()*n,i()*r,1.6+i(),1.6+i(),0,i()<.5?`rgba(255,255,255,0.55)`:`rgba(150,190,255,0.55)`);else if(t===`royal`)for(let e=0;e<300;e++)a(i()*n,i()*r,1.6+i(),1.6+i(),0,i()<.5?`rgba(255,220,90,0.55)`:`rgba(255,140,170,0.5)`);else if(t===`fort`)for(let e=0;e<120;e++)a(i()*n,i()*r,8+i()*12,4+i()*6,i()*3,`rgba(50,100,50,0.13)`)}function yp(e,n=document.createElement(`canvas`)){let r=t.width,i=t.height;n.width=r*hp,n.height=i*hp;let o=n.getContext(`2d`),s=_p(7);for(let t=0;t<i;t++)for(let n=0;n<r;n++)o.fillStyle=(n+t)%2==0?e.grassA:e.grassB,o.fillRect(n*hp,t*hp,hp,hp);for(let e=0;e<1400;e++){let e=s()*n.width,t=s()*n.height;o.fillStyle=s()<.5?`rgba(60,120,40,0.18)`:`rgba(200,240,140,0.16)`,o.beginPath(),o.ellipse(e,t,2+s()*4,1+s()*2,s()*3,0,Math.PI*2),o.fill()}vp(o,e.style,n.width,n.height,s);let c=(t,n,r,i)=>{let a=Math.min(t,r)*hp,s=Math.min(n,i)*hp,c=Math.abs(r-t)*hp,l=Math.abs(i-n)*hp;o.fillStyle=e.path,o.fillRect(a,s,c,l),o.strokeStyle=e.pathLine,o.lineWidth=2;let u=hp/2;for(let e=s;e<=s+l;e+=u)o.beginPath(),o.moveTo(a,e),o.lineTo(a+c,e),o.stroke();for(let e=s,t=0;e<s+l;e+=u,t++)for(let n=a+(t%2?u/2:0);n<=a+c;n+=u)o.beginPath(),o.moveTo(n,e),o.lineTo(n,Math.min(s+l,e+u)),o.stroke();o.strokeStyle=`rgba(120,85,45,0.6)`,o.lineWidth=3,o.strokeRect(a,s,c,l)};for(let n of[!1,!0]){let r=e=>n?i-e:e,s=a.find(e=>e.type===`king`);c(3,r(s.y-.6),15,r(s.y+.6));for(let e of a.filter(e=>e.type===`princess`)){let i=r(e.y),a=n?t.riverTop:t.riverBottom;c(e.x-.7,Math.min(i,a),e.x+.7,Math.max(i,a)),c(e.x-.7,Math.min(r(s.y),i),e.x+.7,Math.max(r(s.y),i))}for(let t of a){let n=t.type===`king`?2.4:1.9,i=r(t.y);o.fillStyle=e.base,o.fillRect((t.x-n)*hp,(i-n)*hp,n*2*hp,n*2*hp),o.strokeStyle=`rgba(110,80,40,0.55)`,o.lineWidth=4,o.strokeRect((t.x-n)*hp,(i-n)*hp,n*2*hp,n*2*hp)}}o.fillStyle=`#2f6f8f`,o.fillRect(0,t.riverTop*hp,n.width,(t.riverBottom-t.riverTop)*hp);let l=o.createLinearGradient(0,0,hp*.6,0);l.addColorStop(0,`rgba(0,0,0,0.25)`),l.addColorStop(1,`rgba(0,0,0,0)`),o.fillStyle=l,o.fillRect(0,0,hp*.6,n.height);let u=o.createLinearGradient(n.width,0,n.width-hp*.6,0);return u.addColorStop(0,`rgba(0,0,0,0.25)`),u.addColorStop(1,`rgba(0,0,0,0)`),o.fillStyle=u,o.fillRect(n.width-hp*.6,0,hp*.6,n.height),n}var bp=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,xp=`
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uLite;
varying vec2 vUv;
void main() {
  vec2 p = vUv * vec2(18.0, 2.0);
  float w = sin(p.x * 1.7 + uTime * 1.4 + sin(p.y * 3.0 + uTime) * 1.2) * 0.5 + 0.5;
  float w2 = sin(p.x * 3.1 - uTime * 2.1 + p.y * 4.0) * 0.5 + 0.5;
  vec3 col = mix(uDeep, uLite, w * 0.6 + w2 * 0.25);
  // 波光
  float glint = smoothstep(0.93, 1.0, sin(p.x * 5.0 + uTime * 2.5 + sin(p.y * 7.0)) * w2);
  col += glint * 0.35;
  // 岸邊白沫
  float edge = min(vUv.y, 1.0 - vUv.y);
  col = mix(vec3(0.85, 0.95, 1.0), col, smoothstep(0.0, 0.12, edge + sin(p.x * 6.0 + uTime * 3.0) * 0.02));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Sp=class{constructor(e){S(this,`group`,new Wr),S(this,`ambience`,new qf),S(this,`water`,void 0),S(this,`canvas`,void 0),S(this,`tex`,void 0),S(this,`decor`,void 0),S(this,`decors`,new Map),S(this,`farMat`,void 0),S(this,`theme`,0);let n=t.width,r=gp[0];this.canvas=yp(r);let i=this.tex=new eo(this.canvas);i.colorSpace=bn,i.anisotropy=Math.min(8,e.capabilities.getMaxAnisotropy()),i.minFilter=at;let a=new Oo({map:i}),o=[[0,t.riverTop],[t.riverBottom,t.height]];for(let[e,r]of o){let i=new mo(n,r-e),o=i.attributes.uv;for(let n=0;n<o.count;n++){let i=e+(1-o.getY(n))*(r-e);o.setY(n,1-i/t.height)}let s=new J(i,a);s.rotation.x=-Math.PI/2,s.position.set(0,0,(e+r)/2-fd),s.receiveShadow=!0,this.group.add(s)}this.water=new Eo({uniforms:{uTime:{value:0},uDeep:{value:new q(r.water[0])},uLite:{value:new q(r.water[1])}},vertexShader:bp,fragmentShader:xp});let s=new J(new mo(n+6,t.riverBottom-t.riverTop),this.water);s.rotation.x=-Math.PI/2,s.position.set(0,-.26,(t.riverTop+t.riverBottom)/2-fd),this.group.add(s),this.decor=Tp(r),this.decors.set(0,this.decor),this.group.add(this.decor),this.group.add(this.ambience.points),this.ambience.setStyle(r.style,this.decor.userData.emitters),this.farMat=new Oo({color:new q(Id(r.outside,-.04)),side:2});let c=new J(new mo(120,120),this.farMat);c.rotation.x=-Math.PI/2,c.position.y=-.7,c.receiveShadow=!0,this.group.add(c)}setTheme(e){let t=Cp(e);if(t===this.theme)return;this.theme=t;let n=gp[t];yp(n,this.canvas),this.tex.needsUpdate=!0,this.decor.visible=!1;let r=this.decors.get(t);r||(r=Tp(n),this.decors.set(t,r),this.group.add(r)),r.visible=!0,this.decor=r,this.ambience.setStyle(n.style,r.userData.emitters),this.farMat.color.set(Id(n.outside,-.04)),this.water.uniforms.uDeep.value.set(n.water[0]),this.water.uniforms.uLite.value.set(n.water[1])}update(e){this.water.uniforms.uTime.value=e,this.ambience.update(e)}setScale(e){this.ambience.setScale(e)}};function Cp(e){return Math.max(0,Math.min(gp.length-1,Math.floor(e)||0))}function wp(e,n,r,i){let a=t.bridgeHalfWidth,o=t.riverTop-fd-.35,s=t.riverBottom-t.riverTop+.7;if(r.bridge===`stone`){let[t,n,c]=r.style===`royal`?[`#e9e1cd`,`#f7f0de`,`#cfc4a8`]:[`#aaa69c`,`#c2beb4`,`#8c887f`];for(let n=0;n<6;n++)for(let r=0;r<3;r++)e.box(a*2/3-.04,.14,s/6-.04,{at:[i-a+(r+.5)*a*2/3,.04,o+(n+.5)*(s/6)],color:(n+r)%2?t:Id(t,-.05)});e.box(a*2+.3,.16,s,{at:[i,-.06,o+s/2],color:c});for(let c of[1,-1]){e.box(.22,.32,s,{at:[i+c*(a+.06),.24,o+s/2],color:t}),e.box(.3,.08,s+.1,{at:[i+c*(a+.06),.43,o+s/2],color:n});for(let l of[0,s])e.box(.36,.62,.36,{at:[i+c*(a+.06),.31,o+l],color:t}),r.style===`royal`?e.sphere(.13,{at:[i+c*(a+.06),.72,o+l],color:`#f2c14a`},8):e.box(.42,.08,.42,{at:[i+c*(a+.06),.66,o+l],color:n})}}else{for(let t=0;t<7;t++)e.box(a*2+.1,.12,s/7-.04,{at:[i,.03,o+(t+.5)*(s/7)],color:t%2?r.wood[0]:r.wood[1]});e.box(a*2+.2,.1,s,{at:[i,-.05,o+s/2],color:Id(r.wood[1],-.3)});for(let t of[1,-1]){if(r.style===`highland`)for(let n of[.32,.5])e.box(.05,.05,s,{at:[i+t*(a+.02),n,o+s/2],color:`#c9b48a`});else e.box(.14,.12,s,{at:[i+t*(a+.02),.42,o+s/2],color:Id(r.wood[0],-.12)});for(let n of[.1,s/2,s-.1])e.cyl(.11,.13,.6,{at:[i+t*(a+.02),.22,o+n],color:Id(r.wood[1],-.25)},6);if(r.style===`lake`)for(let r of[.1,s-.1])e.box(.16,.05,.16,{at:[i+t*(a+.02),.55,o+r],color:`#2e2620`}),n.box(.13,.16,.13,{at:[i+t*(a+.02),.65,o+r],color:`#ffd27a`}),e.box(.16,.04,.16,{at:[i+t*(a+.02),.75,o+r],color:`#2e2620`})}}}function Tp(e){let n=t.width,r=new wd;r.addBone(`root`,-1,[0,0,0]);let i=new wd;i.gradient=!1,i.trackParts=!0,i.addBone(`root`,-1,[0,0,0]);let[a,o,s]=e.wall,c=[t.riverTop-fd,t.riverBottom-fd];for(let e of c){let t=e<0?1:-1;r.box(n+6,.34,.2,{at:[0,-.32/2,e+t*.1],color:Id(s,-.08)});for(let i=0;i<24;i++)r.box(.75,.1,.22,{at:[-n/2-2.5+i*.95+(e>0?.4:0),.02,e+t*.08],color:i%2?Id(a,-.06):Id(a,-.12)})}for(let n of t.bridgeXs)wp(r,i,e,n-dd);if(e.style===`lake`)for(let[e,t,n,i]of[[-8.1,-.45,1,!0],[-7.2,.4,.8,!1],[-2.6,.3,1.1,!0],[-1.4,-.5,.75,!1],[1.8,.45,.9,!1],[2.7,-.35,1,!0],[8.2,.2,1,!0]])fp(r,e,-.245,t,n,i);let l=_p(11);for(let c of[1,-1]){let u=c*(n/2+.35);r.box(.5,.55,t.height+1,{at:[u,.27,0],color:a}),r.box(.6,.12,t.height+1,{at:[u,.58,0],color:o});for(let e=0;e<17;e++)r.box(.62,.16,.08,{at:[u,.36,-16+e*2],color:s});e.style===`royal`&&r.box(.1,.05,t.height+1,{at:[u-c*.24,.66,0],color:`#e6b53c`}),r.box(14,.1,t.height+14,{at:[c*(n/2+7.6),-.06,0],color:e.outside});for(let a=0;a<26;a++){let a=c*(n/2+1.4+l()*8),o=-21+l()*42;Math.abs(o-(t.riverTop+1-fd))<1.6||pp(e.style,r,i,a,o,e,l)}if(e.style===`lake`)for(let e of[-1.6,1.7])dp(r,c*(n/2+1.3),e,1.1,l)}{let c=-(t.height/2+.6);r.box(n+14,.1,9,{at:[0,-.06,c-4.2],color:Id(e.outside,.06)}),r.box(n+2.4,1.15,.8,{at:[0,.57,c],color:a}),r.box(n+2.6,.14,.92,{at:[0,1.2,c],color:o}),e.style===`royal`&&r.box(n+2.62,.06,.94,{at:[0,1.06,c],color:`#e6b53c`});for(let e=0;e<21;e++)r.box(.5,.34,.8,{at:[-n/2-.9+e*.99,1.43,c],color:e%2?Id(o,-.05):o});for(let e=0;e<10;e++)r.box(1.6,.05,.82,{at:[-n/2+.2+e*2,.42+e%2*.36,c],color:s});for(let e of[-6.5,-2.2,2.2,6.5])r.cyl(.05,.05,1.5,{at:[e,1.9,c],color:`#6b4426`},5),r.cone(.2,.75,{at:[e+.36,2.42,c],rot:[0,0,-Math.PI/2],scale:[1,1,.15],color:`#de3b33`},3),r.sphere(.06,{at:[e,2.66,c],color:`#f2b233`},5);for(let t of[-1,1]){let o=t*(n/2+1);r.cyl(.95,1.05,2.3,{at:[o,1.15,c-.2],color:a},12);for(let e of[.7,1.4])r.cyl(1.02,1.02,.06,{at:[o,e,c-.2],color:s},12);r.cyl(1.1,1,.18,{at:[o,2.38,c-.2],color:s},12),r.cone(1.2,1.5,{at:[o,3.22,c-.2],color:e.roof},12),r.sphere(.12,{at:[o,4,c-.2],color:`#f2b233`},6),r.box(.3,.45,.06,{at:[o,1.55,c+.82],color:`#3a2e26`}),e.style===`fort`?sp(r,i,o-t*1.6,c+.9,.9):e.style===`lake`?ap(r,i,o-t*1.5,c+.85,1):e.style===`highland`?op(r,i,o-t*1.6,c+.9,.9,t<0?`#8fe8ff`:`#c99bff`,l):e.style===`royal`?up(r,o-t*1.6,c+.75,1,`#c8323c`,`#e6b53c`):e.style===`autumn`&&ip(r,o-t*1.5,c+.9,1.3)}for(let t=0;t<16;t++){let a=-n/2-3+t*1.6+(l()-.5)*.9,o=c-1.4-l()*2.6,s=.95+l()*.55;mp(e.style,r,i,a,o,s,e,l)}for(let t=0;t<6;t++)r.sphere(3.2,{at:[-n/2-2+t*4.4,-1.2,c-6.5-t%2*1.2],scale:[1.4,.75,1],color:t%2?Id(e.outside,.02):Id(e.outside,.1)},12)}{let c=t.height/2+.35;r.box(n+1.2,.6,.5,{at:[0,.3,c],color:a}),r.box(n+1.2,.12,.6,{at:[0,.62,c],color:o}),e.style===`royal`&&r.box(n+1.22,.05,.62,{at:[0,.7,c],color:`#e6b53c`}),r.box(n+14,.1,6,{at:[0,-.06,c+3.05],color:e.outside});let u=Ep[e.style],d=e.style===`fort`||e.style===`highland`?[Id(a,-.1),Id(s,-.2)]:e.style===`royal`?[`#e6dcc4`,`#5a3a1e`]:[`#8a5a2e`,`#5a3a1e`];for(let t=0;t<6;t++){let a=-n/2+1.2+t*3.1;if(r.box(2.2,.32,.6,{at:[a,.16,c+.75],color:d[0]}),r.box(2.1,.1,.5,{at:[a,.34,c+.75],color:d[1]}),e.style===`royal`&&r.box(2.22,.04,.62,{at:[a,.3,c+.75],color:`#e6b53c`}),e.style===`highland`&&t%2==0)op(r,i,a,c+.75,.45,t%4?`#8fe8ff`:`#c99bff`,l);else for(let e=0;e<6;e++)r.sphere(.13,{at:[a-.85+e*.34,.45,c+.72+e%2*.1],color:u[(t+e)%u.length]},6)}if(e.style===`royal`)for(let e of[-n/2-.3,n/2+.3])cp(r,e,c+.9,.8);for(let e of[-7,7])r.cyl(.06,.06,2.2,{at:[e,1.1,c],color:`#6b4426`},5),r.box(.04,.7,.9,{at:[e,1.75,c-.45],color:`#2f74e8`})}let u=new Wr;u.userData.emitters=i.partAt.filter(e=>Math.abs(e[0])<n/2+2&&Math.abs(e[2])<t.height/2+2).map(e=>[e[0],e[1]+.2,e[2]]);let d=new J(r.build(1).geometry,new Oo({vertexColors:!0}));return d.castShadow=!0,d.receiveShadow=!0,u.add(d),i.parts>0&&u.add(new J(i.build(1).geometry,new ia({vertexColors:!0}))),u}var Ep={meadow:[`#ff8fb0`,`#ffd36b`,`#ffffff`,`#ff6b5a`],fort:[`#5aa046`,`#4c8f3e`,`#ffd36b`,`#5aa046`],autumn:[`#f2a63a`,`#e0782e`,`#ffd36b`,`#c4532a`],lake:[`#9ec8ff`,`#ffffff`,`#c9b5ff`,`#7fb0f0`],highland:[`#c99bff`,`#ffffff`,`#8fe8ff`,`#a0d070`],royal:[`#ff5a6a`,`#ffffff`,`#ffd36b`,`#ff8fb0`]},Dp=216,Op=264,kp={meadow:{top:`#5aa8f0`,mid:`#d6efff`,glow:`#fff4c8`,ground:`#79c457`},forest:{top:`#2e7a52`,mid:`#c4eba6`,glow:`#fff3b8`,ground:`#5c9c3c`},dusk:{top:`#2e2464`,mid:`#a58ad2`,glow:`#efd8ff`,ground:`#56634a`},ember:{top:`#a8301c`,mid:`#ffb760`,glow:`#fff1a6`,ground:`#8a5a3a`},frost:{top:`#2f86d2`,mid:`#dcf7ff`,glow:`#ffffff`,ground:`#cfe9f2`},canyon:{top:`#c0642a`,mid:`#ffdca4`,glow:`#fff3c6`,ground:`#b88a5a`},steel:{top:`#334055`,mid:`#b9c6d8`,glow:`#eef4ff`,ground:`#7d8794`},sky:{top:`#3f86d8`,mid:`#e6f4ff`,glow:`#ffffff`,ground:null},storm:{top:`#1f2f7a`,mid:`#86aef8`,glow:`#e8f4ff`,ground:null},toxic:{top:`#24521c`,mid:`#acdf6c`,glow:`#f3ffb6`,ground:null},blaze:{top:`#8a1f14`,mid:`#ff9a4a`,glow:`#fff0a0`,ground:null},timber:{top:`#3d6f3a`,mid:`#e3eebd`,glow:`#fff6cc`,ground:`#6b9a44`}},Ap={goblins:`forest`,spear_goblins:`forest`,goblin_barrel:`forest`,wolf_rider:`forest`,skeletons:`dusk`,skeleton_army:`dusk`,giant_skeleton:`dusk`,witch:`dusk`,tombstone:`dusk`,bats:`dusk`,gargoyles:`dusk`,wizard:`ember`,fire_spirit:`ember`,inferno:`ember`,baby_dragon:`ember`,ice_spirit:`frost`,golem:`canyon`,cannon:`canyon`,bomber:`canyon`,axe_dwarf:`canyon`,iron_swordsman:`steel`,lancer:`steel`,bomb_blimp:`sky`,arrows:`sky`,rocket:`sky`,zap:`storm`,poison:`toxic`,fireball:`blaze`,log:`timber`,freeze:`frost`,rage:`blaze`,tunneler:`canyon`,elixir_collector:`dusk`,mega_gargoyle:`storm`,gargoyle_horde:`sky`,siege_ram:`canyon`,siege_giant:`steel`,berserkers:`ember`,blowgun_goblin:`forest`,spirit_hut:`ember`,bomb_turret:`canyon`,lightning:`storm`};function jp(e){return kp[Ap[e]??`meadow`]}var Mp=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Np=`
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uGlow;
varying vec2 vUv;
void main() {
  vec3 col = mix(uMid, uTop, smoothstep(0.28, 1.0, vUv.y));
  // 主體後方的柔和光暈與幾道放射光
  vec2 c = vUv - vec2(0.5, 0.6);
  float d = length(c * vec2(1.0, 0.85));
  float ang = atan(c.y, c.x);
  float rays = 0.5 + 0.5 * sin(ang * 9.0);
  col += uGlow * (1.0 - smoothstep(0.0, 0.62, d)) * (0.42 + 0.12 * rays);
  // 四周壓暗（暈影）
  float v = smoothstep(0.98, 0.38, length((vUv - 0.5) * vec2(1.0, 0.9)));
  col *= mix(0.55, 1.0, v);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Pp=new Map;function Fp(e){let t=Pp.get(e);if(t)return t;let n=document.createElement(`canvas`);n.width=n.height=128;let r=n.getContext(`2d`),i=new q(e),a=(e,t)=>`rgba(${Math.round(i.r*255*e)},${Math.round(i.g*255*e)},${Math.round(i.b*255*e)},${t})`,o=r.createRadialGradient(64,64,0,64,64,64);return o.addColorStop(0,a(.45,1)),o.addColorStop(.16,a(.62,1)),o.addColorStop(.32,a(1,1)),o.addColorStop(.62,a(1.05,.85)),o.addColorStop(1,a(1.1,0)),r.fillStyle=o,r.fillRect(0,0,128,128),t=new eo(n),t.colorSpace=bn,Pp.set(e,t),t}var Ip={good:{face:`happy`,arm:-2.6},haha:{face:`laugh`,arm:-.6},wow:{face:`wow`,arm:-1.2},thanks:{face:`happy`,arm:-1.5},grr:{face:`angry`,arm:-2.3},luck:{face:`wink`,arm:-2}},Lp=class{constructor(){S(this,`urls`,new Map),S(this,`emotes`,new Map),S(this,`arts`,new Map),S(this,`listeners`,[]),S(this,`started`,!1),S(this,`failed`,!1),S(this,`ctx`,null),S(this,`cardQueue`,[]),S(this,`emoteJobs`,[]),S(this,`artQueue`,[]),S(this,`pumping`,!1),S(this,`step`,()=>{let e=this.ensureCtx();if(!e){this.pumping=!1;for(let e of this.listeners)e();return}let t=performance.now(),n=Object.keys(f).length,r=()=>performance.now()-t<24;for(;this.cardQueue.length>n-8&&r();)this.safeCard(e,this.cardQueue.shift());for(;this.artQueue.length&&(this.cardQueue.length<=n-8||!this.started)&&r();){let t=this.artQueue.shift();try{this.arts.set(t,Hp(e,t))}catch{this.arts.set(t,``)}}for(;this.cardQueue.length&&!this.artQueue.length&&r();)this.safeCard(e,this.cardQueue.shift());for(;!this.cardQueue.length&&this.emoteJobs.length&&r();){let[t,n]=this.emoteJobs.shift();try{this.renderEmote(e,t,n)}catch{}}for(let e of this.listeners)e();this.cardQueue.length||this.emoteJobs.length||this.artQueue.length?setTimeout(this.step,16):(this.releaseCtx(),this.pumping=!1)})}emote(e,t){return this.emotes.get(`${e}|${t}`)}arenaArt(e){return this.arts.get(e)}get unavailable(){return this.failed}get(e){return this.urls.get(e)}onUpdate(e){this.listeners.push(e)}start(e=Object.keys(f)){if(!(this.started||this.failed)){this.started=!0,this.cardQueue=[...new Set([...e,...Object.keys(f)])];for(let e of[0,1])for(let t of Object.keys(Ip))this.emoteJobs.push([t,e]);this.pump()}}requestArt(e){if(!this.failed){for(let t of e)!this.arts.has(t)&&!this.artQueue.includes(t)&&this.artQueue.push(t);this.artQueue.length&&this.pump()}}pump(){this.pumping||(this.pumping=!0,setTimeout(this.step,30))}ensureCtx(){if(this.ctx)return this.ctx;if(this.failed)return null;let e;try{let t=document.createElement(`canvas`);t.width=Dp,t.height=Op,e=new Ju({canvas:t,alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),e.setPixelRatio(1),e.setSize(Dp,Op,!1),e.outputColorSpace=bn,e.setClearColor(0,0)}catch{return this.failed=!0,null}let t=new Qr;t.add(new ps(`#ffffff`,.55)),t.add(new Zo(`#fff8e8`,`#6f8f5a`,1.1));let n=new fs(`#fff1d6`,3.4);n.position.set(-2.5,3.5,4),t.add(n);let r=new fs(`#d6ecff`,2.6);r.position.set(3,2.5,-3),t.add(r);let i=new us(-1,1,1,-1,.1,100),a=new Qr,o=new Eo({uniforms:{uTop:{value:new q},uMid:{value:new q},uGlow:{value:new q}},vertexShader:Mp,fragmentShader:Np,depthWrite:!1}),s=new J(new mo(2,2),o);s.frustumCulled=!1,a.add(s);let c=new us(-1,1,1,-1,0,1);return this.ctx={r:e,scene:t,cam:i,bgScene:a,bgMat:o,bgCam:c},this.ctx}releaseCtx(){let e=this.ctx;e&&(this.ctx=null,e.bgScene.traverse(e=>e.geometry?.dispose()),e.bgMat.dispose(),e.r.dispose(),e.r.forceContextLoss())}safeCard(e,t){try{this.renderCard(e,t)}catch{}}renderCard(e,t){let{r:n,scene:r,cam:i,bgScene:a,bgMat:o,bgCam:s}=e,c=jp(t);o.uniforms.uTop.value.set(c.top),o.uniforms.uMid.value.set(c.mid),o.uniforms.uGlow.value.set(c.glow);let l=Up(t);r.add(l);let u=c.ground?Rp(l,c.ground):null;Wp(i,l,t),n.autoClear=!1,n.clear(),n.render(a,s),n.clearDepth(),n.render(r,i),n.autoClear=!0,this.urls.set(t,n.domElement.toDataURL(`image/jpeg`,.9)),r.remove(l),u&&(u.removeFromParent(),u.geometry.dispose(),u.material.dispose()),Bp(l)}renderEmote(e,t,n){let{r,scene:i,cam:a}=e,o=Ip[t],s=bd[n],c=Ld(nf(s,o.face,.55),s),l=Td(c,Dd({rim:.5,spec:.3})),u=Yu();u.t=.2,$u(l,Rf(`knight`),u,.016),l.byName.armR?.rotation.set(o.arm,0,.25),l.byName.head?.rotation.set(-.12,n===0?-.15:.15,t===`wow`?.12:0),l.mesh.rotation.y=n===0?.25:-.25;let d=new Wr;d.add(l.mesh),i.add(d),r.setSize(128,128,!1),d.updateMatrixWorld(!0);let f=new pi().setFromObject(d),p=f.getSize(new G),m=new G((f.min.x+f.max.x)/2,f.min.y+p.y*.72,(f.min.z+f.max.z)/2),h=p.y*.62;a.left=-h/2,a.right=h/2,a.top=h/2,a.bottom=-h/2,a.position.copy(m).addScaledVector(new G(0,.25,1).normalize(),20),a.lookAt(m),a.updateProjectionMatrix(),r.setClearColor(0,0),r.clear(),r.render(i,a),this.emotes.set(`${t}|${n}`,r.domElement.toDataURL(`image/png`)),i.remove(d),Bp(d),c.geometry.dispose(),l.mesh.skeleton.dispose(),r.setSize(Dp,Op,!1)}};function Rp(e,t){e.updateMatrixWorld(!0);let n=new pi().setFromObject(e),r=n.getSize(new G),i=new J(new oo(Math.max(r.x,r.z)*1.15+.4,40),new ia({map:Fp(t),transparent:!0,depthWrite:!1}));return i.rotation.x=-Math.PI/2,i.position.set((n.min.x+n.max.x)/2,e.userData.groundY??0,(n.min.z+n.max.z)/2),i.renderOrder=-1,e.parent.add(i),i}var zp=new Lp;function Bp(e){e.traverse(e=>{let t=e;t.material&&!Array.isArray(t.material)&&t.material.dispose(),t.geometry&&!t.geometry.userData.shared&&t.geometry.dispose()})}var Vp=[[[`knight`,0,1.3],[`giant`,0,1.1],[`musketeer`,0,1.15],[`barbarian`,1,1.25],[`goblin`,1,1.3],[`baby_dragon`,0,1]],[[`iron_swordsman`,0,1.3],[`siege_giant`,0,1.1],[`archer`,0,1.25],[`knight`,1,1.25],[`blowgun_goblin`,1,1.3],[`gargoyle`,1,1.1]],[[`berserker`,0,1.3],[`golem`,0,1.05],[`wizard`,0,1.15],[`axe_dwarf`,1,1.3],[`bomber`,1,1.35],[`baby_dragon`,0,1]],[[`knight`,0,1.3],[`giant_skeleton`,0,1.05],[`witch`,0,1.1],[`barbarian`,1,1.25],[`skeleton`,1,1.35],[`bat`,1,1.3]],[[`tunneler`,0,1.35],[`golem`,0,1.05],[`musketeer`,0,1.15],[`iron_swordsman`,1,1.25],[`goblin`,1,1.3],[`mega_gargoyle`,1,1]],[[`lancer`,0,1.05],[`giant`,0,1.1],[`wizard`,0,1.15],[`knight`,1,1.25],[`archer`,1,1.3],[`baby_dragon`,0,1]]];function Hp(e,t){let{r:n,scene:r}=e,i=Cp(t),a=gp[i];n.setSize(480,270,!1);let o=new Wr,s=new wd;s.addBone(`root`,-1,[0,0,0]);let c=new wd;c.gradient=!1,c.addBone(`root`,-1,[0,0,0]);let l=a.style===`highland`?`#6f665a`:a.style===`royal`?`#dccfb1`:a.style===`lake`?`#56584c`:`#6b4a2a`;if(s.cyl(4.6,4.9,.6,{at:[0,-.3,0],color:l},40),a.style===`royal`&&s.torus(4.72,.07,{at:[0,-.08,0],rot:[Math.PI/2,0,0],color:`#e6b53c`},48),s.cyl(4.62,4.62,.12,{at:[0,.02,0],color:a.grassA},40),s.box(1.4,.04,8.6,{at:[-.4,.09,0],rot:[0,.5,0],color:a.path}),s.box(5.2,.5,1.8,{at:[.6,-.15,.4],rot:[0,.5,0],color:a.water[0]}),a.bridge===`stone`){let e=a.style===`royal`?`#ece4d0`:`#b2aea4`;s.box(1.9,.18,2.4,{at:[.6,.12,.4],rot:[0,.5,0],color:e});for(let t of[-1,1]){let n=Math.cos(.5)*t*.95,r=-Math.sin(.5)*t*.95;s.box(.18,.3,2.4,{at:[.6+n,.3,.4+r],rot:[0,.5,0],color:Id(e,-.08)})}}else s.box(1.9,.18,2.4,{at:[.6,.12,.4],rot:[0,.5,0],color:a.wood[1]});let u=(()=>{let e=7+i*13;return()=>(e=e*16807%2147483647)/2147483647})();switch(a.style){case`fort`:Xf(s,-1.1,-3.7,1,a),Xf(s,1.3,-3.8,.9,a),sp(s,c,-3.9,-2.6,.8),ep(s,4,-2.4,.5,a,u);break;case`autumn`:Zf(s,-1.1,-3.7,1,a,u),Zf(s,1.3,-3.8,.85,a,u),rp(s,-3.4,-2.7,.85,.4),ip(s,4,-2.3,1.1);break;case`lake`:Qf(s,-1.1,-3.7,.95,a,u),Qf(s,1.4,-3.8,.8,a,u),ap(s,c,-3.95,-2.5,.9),dp(s,4,-2.4,1,u);break;case`highland`:op(s,c,-1.1,-3.7,1.1,`#8fe8ff`,u),Xf(s,1.3,-3.8,.95,a),tp(s,-3.9,-2.6,.8,a,u),op(s,c,4,-2.4,.8,`#c99bff`,u);break;case`royal`:cp(s,-1.1,-3.7,1.2),lp(s,1.3,-3.8,1),cp(s,-3.9,-2.6,.9),up(s,4,-2.4,.9,`#c8323c`,`#e6b53c`);break;default:Yf(s,-1.1,-3.7,1,a,u),Yf(s,1.3,-3.8,.85,a,u),np(s,-3.9,-2.7,.4,a,u),np(s,4,-2.4,.35,a,u)}o.add(new J(s.build(1).geometry,new Oo({vertexColors:!0}))),c.parts>0&&o.add(new J(c.build(1).geometry,new ia({vertexColors:!0})));let d=(e,t,n,r,i,a=1,s=0,c=.3)=>{let l=Td(Lf(e,t),Dd({rim:.45,spec:.3})),u=Yu();u.t=c,u.windup=c>1?.8:-1,$u(l,Rf(e),u,.016),l.mesh.position.set(n,s,r),l.mesh.rotation.y=i,l.mesh.scale.setScalar(a),o.add(l.mesh)};d(`princess`,0,-2.9,-1.4,.2,.62),d(`princess`,1,3,-1.6,-.3,.55);let[f,p,m,h,g,_]=Vp[i];d(f[0],f[1],-1.2,1.4,.9,f[2],0,2),d(p[0],p[1],-2.4,.4,.7,p[2]),d(h[0],h[1],1.2,1.5,-1,h[2],0,2),d(g[0],g[1],2.4,.9,-.8,g[2]),d(_[0],_[1],-.2,-.6,.6,_[2],2.3),d(m[0],m[1],-3.2,2.2,.5,m[2]),r.add(o);let v=new us(-5.4,5.4,3.04,-3.04,.1,100),y=new G(0,.62,1).normalize();v.position.copy(new G(0,.9,0)).addScaledVector(y,30),v.lookAt(0,.9,0),v.updateProjectionMatrix(),n.setClearColor(0,0),n.clear(),n.render(r,v);let b=n.domElement.toDataURL(`image/png`);return r.remove(o),Bp(o),n.setSize(Dp,Op,!1),b}function Up(e){let t=f[e],n=new Wr;if(n.userData.kind=t.kind,t.kind===`spell`)return n.add(Gp(e)),n;let r=t.unit,i=Math.min(t.count??1,e===`skeleton_army`?4:3),a=i===1?[[0,0,0]]:i===2?[[-.38,0,-.2],[.38,0,.15]]:i===3?[[-.5,0,-.3],[.5,0,-.25],[0,0,.2]]:[[-.6,0,-.4],[.6,0,-.4],[-.3,0,.15],[.35,0,.25]],o=1/Math.max(.8,d[r].stats.half?1.4:Lf(r,0).height*.85),s=Rf(r),c=d[r].stats.flying?Math.max(.45,(s.hover??.8)*.75):0;return a.forEach(([e,i,o],l)=>{let u=Td(Lf(r,0),Dd({rim:.5,spec:.3})),d=Yu();d.t=.3+l*.7,d.windup=t.kind===`troop`&&l===a.length-1?.7:-1,$u(u,s,d,.016);let f=u.mesh;f.position.set(e*Lf(r,0).height,i+c,o),f.rotation.y=-.38+e*.3,n.add(f)}),n.scale.setScalar(o),n.userData.unit=r,n}function Wp(e,t,n){let r=f[n],i=new G(-.35,.42,1).normalize();t.updateMatrixWorld(!0);let a=new pi().setFromObject(t),o=a.getSize(new G),s=a.getCenter(new G),c=Math.max(o.y,o.x*(Op/Dp))*1.08;r.kind===`troop`?Rf(r.unit).rig===`biped`?(s.y=a.min.y+o.y*.66,c=o.y*.78,c=Math.max(c,o.x*(Op/Dp)*.82)):c*=.95:r.kind===`building`&&(c*=.82,s.y+=o.y*.06);let l=Dp/Op*c;e.left=-l/2,e.right=l/2,e.top=c/2,e.bottom=-c/2,e.position.copy(s).addScaledVector(i,20),e.lookAt(s),e.updateProjectionMatrix()}function Gp(e){let t=new Wr,n=new wd;n.addBone(`root`,-1,[0,0,0]);let r=(e,n,r=0,i=0,a=0,o=1,s=!1)=>{let c=new J(new go(n,18,14),new ia({color:e,transparent:o<1||s,opacity:o,blending:s?2:1,depthWrite:!s}));c.position.set(r,i,a),t.add(c)};switch(e){case`fireball`:r(`#fff6c0`,.3,.22,.28,.2),r(`#ffb03a`,.44,.2,.26,0,.92),r(`#ff5a1a`,.66,.2,.26,-.1,.32,!0);for(let e=0;e<7;e++){let t=e/6;n.cone(.3-t*.2,.75-t*.2,{at:[-.25-t*.55,-.12-t*.5,-.15-t*.1],rot:[0,0,2.25+(e%2?.25:-.2)],color:e%3==0?`#ffd36b`:e%3==1?`#ff8a2a`:`#e8461e`},8)}for(let e=0;e<6;e++)r(e%2?`#ffe08a`:`#ff8a3a`,.04+e%3*.015,-.7+e*.22,-.55+e*37%5*.12,.3,1);break;case`arrows`:for(let e=0;e<3;e++){let r=-.45+e*.45,i=.15-e*.12;n.cyl(.04,.04,1.25,{at:[r,i,0],rot:[0,0,.42],color:`#8a5a2e`},6),n.cone(.11,.28,{at:[r-.27,i-.6,0],rot:[0,0,Math.PI+.42],color:`#dfe5ec`},6);for(let t of[-1,1])n.box(.2,.26,.03,{at:[r+.23,i+.55,t*.05],rot:[t*.5,0,.42],color:e===1?`#f2b233`:`#5fbf7a`});for(let e=0;e<2;e++){let n=new J(new mo(.035,.7),new ia({color:`#ffffff`,transparent:!0,opacity:.55}));n.position.set(r+.42+e*.12,i+.85+e*.1,-.05),n.rotation.z=.42,t.add(n)}}break;case`zap`:{let e=[[.25,.95],[-.15,.2],[.18,.12],[-.25,-.85]];for(let t=0;t<e.length-1;t++){let[r,i]=e[t],[a,o]=e[t+1],s=Math.hypot(a-r,o-i),c=Math.atan2(o-i,a-r)-Math.PI/2;n.box(.26,s+.12,.14,{at:[(r+a)/2,(i+o)/2,0],rot:[0,0,c],color:`#ffd23a`}),n.box(.1,s+.05,.16,{at:[(r+a)/2,(i+o)/2,.02],rot:[0,0,c],color:`#fffbe0`})}for(let[t,n]of e)r(`#9fd8ff`,.16,t,n,-.05,.3,!0);r(`#cfeaff`,.6,0,.05,-.4,.1,!0);for(let e=0;e<6;e++){let t=e*1.05;n.box(.04,.18,.04,{at:[Math.cos(t)*.55,Math.sin(t)*.6,.1],rot:[0,0,t],color:`#fff2a0`})}break}case`rocket`:n.cyl(.22,.22,1.1,{at:[.05,.05,0],rot:[0,0,-.8],color:`#e6dfcc`},14);for(let e of[-.25,.15])n.cyl(.225,.225,.1,{at:[.05+e*.72,.05+e*.7,0],rot:[0,0,-.8],color:`#c0392b`},14);n.cone(.23,.48,{at:[.6,.6,0],rot:[0,0,-.8],color:`#c0392b`},14);for(let e of[1,-1])n.box(.05,.4,.42,{at:[-.38+e*.14,-.38-e*.14,0],rot:[0,0,-.8],color:`#a8301c`});for(let e=0;e<3;e++)n.cone(.17-e*.04,.42+e*.12,{at:[-.62-e*.08,-.62-e*.08,0],rot:[0,0,2.35],color:[`#fff3a0`,`#ffb03a`,`#ff6a2a`][e]},10);r(`#ffd36b`,.28,-.6,-.6,.05,.5,!0);for(let e=0;e<4;e++)r(`#d9d4cc`,.16+e*.05,-.9-e*.12,-.95-e*.05,-.2,.7);break;case`log`:n.cyl(.38,.38,1.6,{rot:[0,0,Math.PI/2-.25],color:`#8a5a2e`},16),n.cyl(.33,.33,.05,{at:[.78,.2,0],rot:[0,0,Math.PI/2-.25],color:`#d9b77a`},16),n.torus(.2,.025,{at:[.8,.205,0],rot:[0,Math.PI/2,.25],color:`#b88a50`},14);for(let e=0;e<5;e++)n.cone(.07,.26,{at:[-.6+e*.3,.3+e*.075,.22],rot:[.4,0,-.25],color:`#5a3a1e`},5);for(let e=0;e<5;e++)r(`#d8c39a`,.12+e%2*.06,-.7+e*.3,-.42-e%2*.05,.3,.75);break;case`poison`:n.lathe([[.01,-.6],[.44,-.54],[.53,-.22],[.44,.14],[.17,.3],[.17,.56],[.23,.62]],{color:`#3d6f2a`},18),n.cyl(.15,.15,.2,{at:[0,.7,0],color:`#8a5a2e`},10),r(`#9dff4a`,.4,0,-.2,.12,.85),n.sphere(.16,{at:[0,-.15,.48],scale:[1,1,.4],color:`#f4f1e8`},12);for(let e of[1,-1])n.sphere(.04,{at:[e*.055,-.13,.54],color:`#2a3a1e`},6);for(let e=0;e<5;e++)r(`#d6ff8a`,.05+e%3*.025,-.15+e*29%7*.05,.75+e*.16,.1,.9);break;case`freeze`:for(let e=0;e<6;e++){let t=e/6*Math.PI*2;n.box(.12,.95,.08,{at:[Math.sin(t)*.42,Math.cos(t)*.42,0],rot:[0,0,-t],color:`#d8f6ff`});for(let e of[1,-1])n.box(.07,.32,.06,{at:[Math.sin(t)*.62+Math.sin(t+e*.9)*.12,Math.cos(t)*.62+Math.cos(t+e*.9)*.12,.02],rot:[0,0,-t-e*.9],color:`#bfeeff`})}n.gem(.24,{at:[0,0,.05],color:`#ffffff`}),r(`#9fe2ff`,.75,0,0,-.3,.25,!0);for(let e=0;e<5;e++)n.gem(.07+e%2*.04,{at:[-.75+e*.38,-.85+e*3%4*.08,.2],color:`#e8faff`});break;case`rage`:n.lathe([[.01,-.62],[.36,-.58],[.46,-.32],[.4,0],[.15,.18],[.15,.42],[.2,.47]],{color:`#7a2a4a`},18),r(`#ff3a6a`,.36,0,-.28,.1,.9),n.cyl(.13,.13,.16,{at:[0,.54,0],color:`#8a5a2e`},10);for(let e=0;e<6;e++)r(e%2?`#ff9ab0`:`#ff4a6a`,.07+e%3*.03,-.25+e*37%5*.12,.7+e*.13,.05,.85);r(`#ff6a8a`,.8,0,.2,-.4,.22,!0);break;case`goblin_barrel`:n.cyl(.45,.45,.85,{rot:[.2,0,0],color:`#9a6834`},14),n.torus(.46,.04,{at:[0,.28,.06],rot:[Math.PI/2+.2,0,0],color:`#5a5f6b`},16),n.torus(.46,.04,{at:[0,-.28,-.06],rot:[Math.PI/2+.2,0,0],color:`#5a5f6b`},16),n.sphere(.24,{at:[0,.62,.05],color:`#7cbf4a`},12);for(let e of[1,-1])n.cone(.07,.25,{at:[e*.28,.66,.05],rot:[0,0,-e*1.3],color:`#7cbf4a`},5),n.sphere(.05,{at:[e*.08,.66,.26],color:`#1b1b22`},6);for(let e=0;e<3;e++){let n=new J(new mo(.04,.55),new ia({color:`#ffffff`,transparent:!0,opacity:.5}));n.position.set(-.55-e*.12,.5+e*.12,-.2),n.rotation.z=-.9,t.add(n)}break;case`lightning`:{let e=[[0,.62,0,.42],[-.42,.55,-.05,.32],[.44,.56,0,.34],[-.2,.78,-.1,.32],[.22,.8,-.12,.3]];for(let[t,r,i,a]of e)n.sphere(a,{at:[t,r,i],scale:[1.2,.8,.9],color:`#5a5070`},12);for(let[t,r,i,a]of e)n.sphere(a*.6,{at:[t+.05,r+a*.35,i+.15],scale:[1.1,.6,.6],color:`#8a80a8`},10);for(let e of[[[-.42,.35],[-.28,-.05],[-.46,-.15],[-.3,-.75]],[[.05,.3],[.2,-.1],[-.02,-.22],[.12,-.95]],[[.45,.35],[.34,0],[.52,-.12],[.4,-.65]]]){for(let t=0;t<e.length-1;t++){let[r,i]=e[t],[a,o]=e[t+1],s=Math.hypot(a-r,o-i),c=Math.atan2(o-i,a-r)-Math.PI/2;n.box(.12,s+.06,.08,{at:[(r+a)/2,(i+o)/2,.2],rot:[0,0,c],color:`#c9b8ff`}),n.box(.05,s+.03,.1,{at:[(r+a)/2,(i+o)/2,.22],rot:[0,0,c],color:`#ffffff`})}let[t,i]=e[e.length-1];r(`#d9ccff`,.16,t,i,.2,.55,!0)}r(`#b9a8ff`,.75,0,.1,-.5,.12,!0);break}default:r(`#ffffff`,.4)}if(n.parts>0){let e=new J(n.build(1).geometry,new Oo({vertexColors:!0}));t.add(e)}return t}bd[0].main;var Kp=`
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale;
}`,qp=`
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  float a = smoothstep(0.5, 0.18, r) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}`,Jp=class{constructor(e,t){S(this,`cap`,void 0),S(this,`points`,void 0),S(this,`pos`,void 0),S(this,`col`,void 0),S(this,`size`,void 0),S(this,`alpha`,void 0),S(this,`st`,[]),S(this,`next`,0),S(this,`material`,void 0),S(this,`count`,0),this.cap=e;let n=new Ki;this.pos=new Float32Array(e*3),this.col=new Float32Array(e*3),this.size=new Float32Array(e),this.alpha=new Float32Array(e),n.setAttribute(`position`,new ji(this.pos,3)),n.setAttribute(`aColor`,new ji(this.col,3)),n.setAttribute(`aSize`,new ji(this.size,1)),n.setAttribute(`aAlpha`,new ji(this.alpha,1)),this.material=new Eo({uniforms:{uScale:{value:20}},vertexShader:Kp,fragmentShader:qp,transparent:!0,depthWrite:!1,blending:t}),this.points=new Za(n,this.material),this.points.frustumCulled=!1,this.points.renderOrder=t===2?6:5;for(let t=0;t<e;t++)this.st.push({life:0,max:0,vx:0,vy:0,vz:0,grav:0,drag:0,size0:0,size1:0,a0:0,r:0,g:0,b:0,r1:0,g1:0,b1:0})}emit(e,t,n,r,i,a,o,s,c,l,u,d,f,p){let m=this.next;this.next=(this.next+1)%this.cap;let h=this.st[m];h.life=o,h.max=o,h.vx=r,h.vy=i,h.vz=a,h.grav=f,h.drag=p,h.size0=s,h.size1=c,h.a0=d,h.r=l.r,h.g=l.g,h.b=l.b,h.r1=u.r,h.g1=u.g,h.b1=u.b,this.pos[m*3]=e,this.pos[m*3+1]=t,this.pos[m*3+2]=n}update(e){let t=0;for(let n=0;n<this.cap;n++){let r=this.st[n];if(r.life<=0){this.alpha[n]!==0&&(this.alpha[n]=0);continue}t++,r.life-=e;let i=1-Math.max(0,r.life)/r.max,a=Math.max(0,1-r.drag*e);r.vx*=a,r.vz*=a,r.vy=r.vy*a-r.grav*e,this.pos[n*3]+=r.vx*e,this.pos[n*3+1]+=r.vy*e,this.pos[n*3+2]+=r.vz*e,this.pos[n*3+1]<.02&&r.grav>0&&(this.pos[n*3+1]=.02,r.vy=Math.abs(r.vy)*.3,r.vx*=.6,r.vz*=.6),this.size[n]=r.size0+(r.size1-r.size0)*i,this.alpha[n]=r.a0*(i<.15?i/.15:1-(i-.15)/.85),this.col[n*3]=r.r+(r.r1-r.r)*i,this.col[n*3+1]=r.g+(r.g1-r.g)*i,this.col[n*3+2]=r.b+(r.b1-r.b)*i}this.count=t;let n=this.points.geometry;n.attributes.position.needsUpdate=!0,n.attributes.aColor.needsUpdate=!0,n.attributes.aSize.needsUpdate=!0,n.attributes.aAlpha.needsUpdate=!0}clear(){for(let e of this.st)e.life=0;this.alpha.fill(0)}},Yp=new q,Xp=new q,Zp=class{constructor(){S(this,`group`,new Wr),S(this,`soft`,new Jp(1400,1)),S(this,`glow`,new Jp(1400,2)),S(this,`rings`,[]),S(this,`decals`,[]),S(this,`bolts`,[]),S(this,`flashes`,[]),S(this,`flashGeo`,new go(1,16,12)),S(this,`ringGeo`,new ho(.86,1,40)),S(this,`discGeo`,new oo(1,28)),S(this,`boltGeo`,new so(.06,.06,1,4,1,!0)),this.group.add(this.soft.points,this.glow.points),this.boltGeo.translate(0,.5,0)}setScale(e){this.soft.material.uniforms.uScale.value=e,this.glow.material.uniforms.uScale.value=e}get count(){let e=e=>e.filter(e=>e.t<e.life).length;return this.soft.count+this.glow.count+e(this.rings)+e(this.decals)+e(this.bolts)+e(this.flashes)}burst(e,t,n,r,i=1,a){let o=Math.random,s=(e,t)=>{for(let n=0;n<e;n++)t(n)};switch(e){case`dust`:s(a??Math.round(10*i),()=>{let e=o()*Math.PI*2,a=(.8+o()*1.6)*i;Yp.set(`#d9c9a8`),Xp.set(`#bfae8c`),this.soft.emit(t,n+.1,r,Math.cos(e)*a,.4+o()*.6,Math.sin(e)*a,.5+o()*.4,.35*i,.9*i,Yp,Xp,.7,.6,3)});break;case`smoke`:s(a??Math.round(8*i),()=>{Yp.set(`#d8d4cc`),Xp.set(`#f4f2ee`);let e=Math.min(1.1,.45*i);this.soft.emit(t+(o()-.5)*i*.8,n+o()*.3,r+(o()-.5)*i*.8,(o()-.5)*.8,.9+o()*.8,(o()-.5)*.8,.7+o()*.6,e,e*2,Yp,Xp,.42,-.2,1.5)});break;case`spark`:s(a??Math.round(8*i),()=>{let e=o()*Math.PI*2,a=(2+o()*4)*i;Yp.set(`#fff7c2`),Xp.set(`#ffb347`),this.glow.emit(t,n,r,Math.cos(e)*a,1+o()*3,Math.sin(e)*a,.18+o()*.2,.22,.05,Yp,Xp,1,9,2)});break;case`fire`:s(a??Math.round(14*i),()=>{let e=o()*Math.PI*2,a=(.5+o()*2.5)*i;Yp.set(o()<.5?`#ffe08a`:`#ffb347`),Xp.set(`#d8401a`),this.glow.emit(t,n+o()*.3,r,Math.cos(e)*a,.6+o()*1.8,Math.sin(e)*a,.35+o()*.35,.7*i,.25*i,Yp,Xp,.9,-1,3)});break;case`ice`:s(a??Math.round(12*i),()=>{let e=o()*Math.PI*2,a=(.8+o()*2)*i;Yp.set(`#f2fbff`),Xp.set(`#7fd3ff`),this.glow.emit(t,n+o()*.4,r,Math.cos(e)*a,.5+o()*1.5,Math.sin(e)*a,.4+o()*.4,.3*i,.1,Yp,Xp,.9,3,2)});break;case`poison`:s(a??Math.round(4*i),()=>{let e=o()*Math.PI*2,a=Math.sqrt(o())*i;Yp.set(`#b8f06a`),Xp.set(`#4f8f2a`),this.soft.emit(t+Math.cos(e)*a,n+.05,r+Math.sin(e)*a,0,.5+o()*.6,0,.8+o()*.6,.35,.6,Yp,Xp,.6,-.2,1)});break;case`debris`:s(a??Math.round(12*i),()=>{let e=o()*Math.PI*2,a=(1.5+o()*3)*i;Yp.set(o()<.5?`#9a958a`:`#7a7468`),Xp.set(`#6a655a`),this.soft.emit(t,n+.4,r,Math.cos(e)*a,3+o()*4,Math.sin(e)*a,.8+o()*.5,.32,.28,Yp,Xp,1,14,.5)});break;case`splinter`:s(a??10,()=>{let e=o()*Math.PI*2,i=2+o()*2.5;Yp.set(`#b07a42`),Xp.set(`#7a5230`),this.soft.emit(t,n+.3,r,Math.cos(e)*i,2+o()*3,Math.sin(e)*i,.6+o()*.3,.2,.16,Yp,Xp,1,12,.5)});break;case`magic`:s(a??Math.round(10*i),()=>{let e=o()*Math.PI*2,a=(.6+o()*1.8)*i;Yp.set(`#e6b8ff`),Xp.set(`#7a2fd0`),this.glow.emit(t,n+o()*.3,r,Math.cos(e)*a,.4+o()*1.2,Math.sin(e)*a,.4+o()*.3,.35*i,.1,Yp,Xp,.9,0,2)});break;case`elixir`:s(a??10,()=>{let e=o()*Math.PI*2,i=.8+o()*1.2;Yp.set(`#ffb8f0`),Xp.set(`#c03ad8`),this.glow.emit(t,n+.2,r,Math.cos(e)*i,1+o(),Math.sin(e)*i,.45+o()*.2,.28,.08,Yp,Xp,.9,2,2)});break;case`rage`:s(a??Math.round(6*i),()=>{let e=o()*Math.PI*2,a=Math.sqrt(o())*i;Yp.set(o()<.5?`#ff9ab0`:`#ff6a88`),Xp.set(`#a0163a`),this.glow.emit(t+Math.cos(e)*a,n,r+Math.sin(e)*a,0,1.2+o()*1.2,0,.5+o()*.4,.3,.06,Yp,Xp,.9,-.5,1)});break;case`stun`:s(a??6,()=>{let e=o()*Math.PI*2;Yp.set(`#fffbd0`),Xp.set(`#8fdcff`),this.glow.emit(t+Math.cos(e)*.3,n,r+Math.sin(e)*.3,Math.cos(e)*1.2,1.5+o(),Math.sin(e)*1.2,.25,.25,.05,Yp,Xp,1,4,1)});break;case`heal`:case`blood`:case`water`:s(a??8,()=>{let i=o()*Math.PI*2;Yp.set(e===`water`?`#e8f7ff`:`#ffffff`),Xp.set(e===`water`?`#6fc3ff`:`#dddddd`),this.soft.emit(t,n,r,Math.cos(i)*1.5,1.5+o()*2,Math.sin(i)*1.5,.4,.2,.1,Yp,Xp,.9,8,1)})}}trail(e,t,n,r){let i=Math.random;switch(e){case`fire`:Yp.set(`#ffd36b`),Xp.set(`#d8401a`),this.glow.emit(t+(i()-.5)*.15,n+(i()-.5)*.15,r+(i()-.5)*.15,0,.6,0,.3,.55,.15,Yp,Xp,.9,-1,1);break;case`smoke`:Yp.set(`#c9c9c9`),Xp.set(`#efefef`),this.soft.emit(t,n,r,(i()-.5)*.3,.3,(i()-.5)*.3,.8,.3,.9,Yp,Xp,.5,-.3,1);break;case`magic`:Yp.set(`#f0c8ff`),Xp.set(`#7a2fd0`),this.glow.emit(t,n,r,(i()-.5)*.5,.3,(i()-.5)*.5,.35,.35,.05,Yp,Xp,.9,0,1);break;case`ice`:Yp.set(`#ffffff`),Xp.set(`#7fd3ff`),this.glow.emit(t,n,r,(i()-.5)*.4,.2,(i()-.5)*.4,.3,.3,.05,Yp,Xp,.9,0,1);break;case`spark`:Yp.set(`#fff2a8`),Xp.set(`#ff8a2a`),this.glow.emit(t,n,r,(i()-.5)*1.5,i()*1.5,(i()-.5)*1.5,.2,.15,.04,Yp,Xp,1,6,1)}}ring(e,t,n,r,i,a=.45,o=.85,s=.06){let c=this.rings.find(e=>e.t>=e.life);if(!c){if(this.rings.length>=40)return;let e=new J(this.ringGeo,new ia({transparent:!0,depthWrite:!1,side:2}));e.rotation.x=-Math.PI/2,e.renderOrder=4,this.group.add(e),c={mesh:e,t:0,life:a,r0:n,r1:r,a0:o},this.rings.push(c)}c.t=0,c.life=a,c.r0=n,c.r1=r,c.a0=o,c.mesh.visible=!0,c.mesh.position.set(e,s,t),c.mesh.material.color.set(i)}decal(e,t,n,r=`#2a2218`,i=4){let a=this.decals.find(e=>e.t>=e.life);if(!a){if(this.decals.length>=24)return;let e=new J(this.discGeo,new ia({transparent:!0,depthWrite:!1,opacity:.3}));e.rotation.x=-Math.PI/2,e.renderOrder=1,this.group.add(e),a={mesh:e,t:0,life:i},this.decals.push(a)}a.t=0,a.life=i,a.mesh.visible=!0,a.mesh.position.set(e,.025,t),a.mesh.scale.setScalar(n),a.mesh.material.color.set(r)}flash(e,t,n,r,i,a,o=.28,s=.9){let c=this.flashes.find(e=>e.t>=e.life);if(!c){if(this.flashes.length>=16)return;let e=new J(this.flashGeo,new ia({transparent:!0,depthWrite:!1,blending:2}));e.renderOrder=8,this.group.add(e),c={mesh:e,t:0,life:o,r0:r,r1:i,a0:s},this.flashes.push(c)}c.t=0,c.life=o,c.r0=r,c.r1=i,c.a0=s,c.mesh.visible=!0,c.mesh.position.set(e,t,n),c.mesh.scale.setScalar(r),c.mesh.material.color.set(a)}bolt(e,t,n=`#bfe8ff`){let r=e+(Math.random()-.5)*1.5,i=7,a=t-1.5;for(let o=1;o<=5;o++){let s=o/5,c=o===5?e:e+(Math.random()-.5)*1.2*(1-s),l=7*(1-s)+.1,u=o===5?t:t-1.5*(1-s)+(Math.random()-.5)*.6;this.segment(new G(r,i,a),new G(c,l,u),n,.22),r=c,i=l,a=u}}segment(e,t,n,r){let i=this.bolts.find(e=>e.t>=e.life);if(!i){if(this.bolts.length>=60)return;let e=new J(this.boltGeo,new ia({transparent:!0,depthWrite:!1,blending:2}));e.renderOrder=7,this.group.add(e),i={mesh:e,t:0,life:r},this.bolts.push(i)}i.t=0,i.life=r,i.mesh.visible=!0;let a=t.clone().sub(e),o=a.length();i.mesh.position.copy(e),i.mesh.scale.set(1.6,o,1.6),i.mesh.quaternion.setFromUnitVectors(new G(0,1,0),a.normalize()),i.mesh.material.color.set(n)}update(e){this.soft.update(e),this.glow.update(e);for(let t of this.rings){if(t.t>=t.life)continue;t.t+=e;let n=Math.min(1,t.t/t.life),r=t.r0+(t.r1-t.r0)*(1-(1-n)*(1-n));t.mesh.scale.setScalar(Math.max(.01,r)),t.mesh.material.opacity=t.a0*(1-n),t.t>=t.life&&(t.mesh.visible=!1)}for(let t of this.decals){if(t.t>=t.life)continue;t.t+=e;let n=t.t/t.life;t.mesh.material.opacity=.3*(n<.7?1:1-(n-.7)/.3),t.t>=t.life&&(t.mesh.visible=!1)}for(let t of this.flashes){if(t.t>=t.life)continue;t.t+=e;let n=Math.min(1,t.t/t.life);t.mesh.scale.setScalar(t.r0+(t.r1-t.r0)*(1-(1-n)*(1-n)*(1-n))),t.mesh.material.opacity=t.a0*(1-n)*(1-n),t.t>=t.life&&(t.mesh.visible=!1)}for(let t of this.bolts)t.t>=t.life||(t.t+=e,t.mesh.material.opacity=Math.max(0,1-t.t/t.life)*(Math.random()<.3?.4:1),t.t>=t.life&&(t.mesh.visible=!1))}clear(){this.soft.clear(),this.glow.clear();for(let e of[...this.rings,...this.decals,...this.bolts,...this.flashes])e.t=e.life,e.mesh.visible=!1}},Qp=11,$p=class{constructor(e){S(this,`canvas`,void 0),S(this,`ctx`,void 0),S(this,`w`,0),S(this,`h`,0),S(this,`dpr`,1),S(this,`floats`,[]),this.canvas=e,this.ctx=e.getContext(`2d`)}resize(e,t,n){this.w=e,this.h=t,this.dpr=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n),this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}begin(){let e=this.ctx;e.setTransform(this.dpr,0,0,this.dpr,0,0),e.clearRect(0,0,this.w,this.h)}unitBar(e,t,n,r,i,a){let o=this.ctx,s=Math.max(4,Math.round(n*.13)),c=e-n/2,l=t-s/2;o.fillStyle=`rgba(12,16,22,0.78)`,em(o,c-1.5,l-1.5,n+3,s+3,2.5),o.fill(),o.fillStyle=bd[i].bar,o.fillRect(c,l,Math.max(0,Math.min(1,r))*n,s),o.fillStyle=`rgba(255,255,255,0.28)`,o.fillRect(c,l,Math.max(0,Math.min(1,r))*n,Math.max(1,s*.35)),a&&this.levelBadge(c-s*1.25,t,s*2.2,i)}levelBadge(e,t,n,r){let i=this.ctx,a=n;i.fillStyle=bd[r].dark,em(i,e-a/2,t-a/2,a,a,a*.25),i.fill(),i.strokeStyle=`rgba(255,255,255,0.85)`,i.lineWidth=Math.max(1,a*.09),i.stroke(),i.fillStyle=`#fff`,i.font=`900 ${Math.round(a*.62)}px system-ui, -apple-system, sans-serif`,i.textAlign=`center`,i.textBaseline=`middle`,i.fillText(String(Qp),e,t+a*.04)}towerBar(e,t,n,r,i,a,o,s){let c=this.ctx,l=Math.max(7,Math.round(9*s)),u=e-n/2,d=t-l/2;c.fillStyle=`rgba(12,16,22,0.82)`,em(c,u-2,d-2,n+4,l+4,3),c.fill(),c.fillStyle=bd[a].bar,c.fillRect(u,d,Math.max(0,Math.min(1,i))*n,l),c.fillStyle=`rgba(255,255,255,0.3)`,c.fillRect(u,d,Math.max(0,Math.min(1,i))*n,l*.38);let f=l*1.9;if(this.levelBadge(u-f*.55,t,f,a),o){c.fillStyle=`#f2b233`;let e=u-f*.55,n=t-f*.85,r=f*.45;c.beginPath(),c.moveTo(e-r,n+r*.55),c.lineTo(e-r,n-r*.35),c.lineTo(e-r*.45,n+r*.05),c.lineTo(e,n-r*.55),c.lineTo(e+r*.45,n+r*.05),c.lineTo(e+r,n-r*.35),c.lineTo(e+r,n+r*.55),c.closePath(),c.fill()}c.font=`900 ${Math.round(l*1.15)}px system-ui, -apple-system, sans-serif`,c.textAlign=`left`,c.textBaseline=`bottom`,c.lineWidth=3,c.strokeStyle=`rgba(0,0,0,0.75)`;let p=String(Math.ceil(r));c.strokeText(p,u+2,d-1),c.fillStyle=`#ffffff`,c.fillText(p,u+2,d-1)}deployTimer(e,t,n,r,i){let a=this.ctx;a.fillStyle=`rgba(12,16,22,0.6)`,a.beginPath(),a.arc(e,t,n,0,Math.PI*2),a.fill(),a.strokeStyle=bd[i].light,a.lineWidth=Math.max(2,n*.35),a.beginPath(),a.arc(e,t,n*.72,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(1,r))),a.stroke()}addFloat(e,t,n,r,i=18,a=.9){this.floats.push({x:e,y:t,text:n,color:r,t:0,life:a,size:i})}drawFloats(e,t){let n=this.ctx;for(let r of this.floats){r.t+=e;let i=r.t/r.life,[a,o]=t(r.x,r.y);n.globalAlpha=i<.7?1:1-(i-.7)/.3,n.font=`900 ${Math.round(r.size*(i<.15?.6+i/.15*.5:1.1-Math.min(.1,(i-.15)*.2)))}px system-ui, -apple-system, sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.lineWidth=4,n.strokeStyle=`rgba(40,10,50,0.85)`;let s=o-i*28;n.strokeText(r.text,a,s),n.fillStyle=r.color,n.fillText(r.text,a,s)}n.globalAlpha=1,this.floats=this.floats.filter(e=>e.t<e.life)}bigCountdown(e,t){let n=this.ctx;n.globalAlpha=.28+.25*(1-t),n.font=`900 ${Math.round(this.h*.22*(1.15-t*.15))}px system-ui, -apple-system, sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillStyle=`#ffffff`,n.lineWidth=6,n.strokeStyle=`rgba(0,0,0,0.5)`,n.strokeText(String(e),this.w/2,this.h*.45),n.fillText(String(e),this.w/2,this.h*.45),n.globalAlpha=1}};function em(e,t,n,r,i,a){e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+r,n,t+r,n+i,a),e.arcTo(t+r,n+i,t,n+i,a),e.arcTo(t,n+i,t,n,a),e.arcTo(t,n,t+r,n,a),e.closePath()}function tm(e,t={}){let n=new Ju({canvas:e,antialias:t.antialias??!0,alpha:t.alpha??!1,preserveDrawingBuffer:t.preserve??!1,powerPreference:`high-performance`});return n.outputColorSpace=bn,n.shadowMap.enabled=!0,n.shadowMap.type=1,n}function nm(e,t=2048){let n=new Qr;n.background=new q(`#2d4f2a`);let r=new Zo(`#fff6e0`,`#6f8f4f`,2.1);n.add(r);let i=new fs(`#fff1d6`,2.6);i.position.set(9,22,12),i.target.position.set(0,0,0),i.castShadow=!0,i.shadow.mapSize.set(t,t);let a=i.shadow.camera;return a.left=-15,a.right=15,a.top=21,a.bottom=-21,a.near=1,a.far=60,i.shadow.bias=-8e-4,i.shadow.normalBias=.03,i.shadow.radius=2,n.add(i),n.add(i.target),{renderer:e,scene:n,sun:i,hemi:r}}var rm=e=>e<=0?0:e>=1?1:1-(1-e)*(1-e),im=class{constructor(e,t){S(this,`e`,void 0),S(this,`inst`,void 0),S(this,`prof`,void 0),S(this,`st`,Yu()),S(this,`mat`,void 0),S(this,`height`,void 0),S(this,`yaw`,void 0),S(this,`flash`,0),S(this,`dropT`,1),S(this,`popT`,1),S(this,`dyingT`,-1),S(this,`kamikaze`,!1),S(this,`x`,0),S(this,`z`,0),S(this,`hover`,0),S(this,`shadowIdx`,-1),S(this,`lastAttackSeen`,-99),S(this,`removed`,!1),S(this,`scale`,void 0),this.e=e,this.prof=Rf(e.unit),this.mat=Dd();let n=Lf(e.unit,e.team);this.height=n.height,this.inst=Td(n,this.mat),this.yaw=vd(e.facing),this.hover=this.prof.hover??0,this.scale=e.kind===`troop`?this.height<1.1?1.6:this.height>1.8?1.26:1.48:1,t.add(this.inst.mesh),e.kind===`building`&&(this.yaw=e.team===0?Math.PI:0)}get id(){return this.e.id}update(e,n,r,i){let a=this.e,o=a.px+(a.x-a.px)*e,s=a.py+(a.y-a.py)*e;this.x=gd(o),this.z=_d(s);let c=this.st;if(this.dyingT<0){if(c.moving=a.moving,c.speed=a.stats.speed*(a.charging?2:1),c.charging=a.charging,c.jumping=a.jumping,c.frozen=a.frozen&&a.stunTimer>0,a.attacking&&a.deployTimer<=0&&a.stunTimer<=0){let e=Math.max(.15,a.stats.loadTime);c.windup=a.cooldown<=e?1-a.cooldown/e:-1}else c.windup=-1;if(a.lastAttack!==this.lastAttackSeen&&(this.lastAttackSeen=a.lastAttack,i-a.lastAttack<.2&&(c.sinceHit=0)),a.kind!==`building`){let e=vd(a.facing);this.yaw=yd(this.yaw,e,Math.min(1,n*10))}else a.targetId>=0&&a.attacking&&(c.aimYaw=0)}$u(this.inst,this.prof,c,r);let l=this.inst.mesh,u=this.hover>0?this.hover+Math.sin(c.t*2.2)*.08:0;if(a.jumping){let e=(s-t.riverTop)/(t.riverBottom-t.riverTop);u+=Math.sin(Math.max(0,Math.min(1,e))*Math.PI)*.9}let d=1,f=1;if(this.dropT<1){this.dropT=Math.min(1,this.dropT+n/.32);let e=this.dropT;if(u+=(1-rm(e))*2.6,e>.85){let t=Math.sin((e-.85)/.15*Math.PI)*.22;f=1-t,d=1+t*.6}}if(this.popT<1){this.popT=Math.min(1,this.popT+n/.25);let e=rm(this.popT);d*=e,f*=e}if(this.dyingT>=0){this.dyingT+=n;let e=Math.min(1,this.dyingT/.55),t=this.e.id%2?1:-1,r=rm(e*1.4);l.rotation.set(-1.15*r,this.yaw,t*.55*r,`YXZ`),u+=Math.sin(Math.min(1,e*2.5)*Math.PI)*.22,u-=e*.35+(this.hover>0?this.hover*rm(e):0),this.mat.transparent=!0,this.mat.opacity=1-rm((e-.35)/.65)}else l.rotation.set(0,this.yaw,0);l.position.set(this.x,u,this.z),l.scale.set(d*this.scale,f*this.scale,d*this.scale),this.flash=Math.max(0,this.flash-n*9);let p=a.deployTimer>0&&this.dyingT<0,m=a.rageTimer>0?.6+Math.sin(c.t*9)*.4:0;Od(this.mat,this.flash*this.flash*.5,c.frozen,a.stunTimer>0&&!a.frozen,m),this.dyingT<0&&(this.mat.transparent=p,this.mat.opacity=p?.55+.45*(1-a.deployTimer/Math.max(.3,a.stats.deployTime)):1)}get done(){return this.dyingT>=.6}dispose(){this.inst.mesh.removeFromParent(),this.inst.mesh.skeleton.dispose(),this.mat.dispose(),this.removed=!0}},am=class{constructor(e,t){S(this,`e`,void 0),S(this,`parent`,void 0),S(this,`inst`,void 0),S(this,`mat`,void 0),S(this,`st`,Yu()),S(this,`rubble`,null),S(this,`flash`,0),S(this,`down`,!1),S(this,`height`,void 0),S(this,`lastAttackSeen`,-99),S(this,`collapseT`,1),this.e=e,this.parent=t,this.mat=Dd({rim:.22});let n=Lf(e.unit,e.team);this.height=n.height,this.inst=Td(n,this.mat);let r=this.inst.mesh;r.position.set(gd(e.x),0,_d(e.y)),r.rotation.y=e.team===0?Math.PI:0,r.receiveShadow=!0,t.add(r)}update(e,t,n){let r=this.e;if(!r.alive){this.down||this.collapse(),this.animateCollapse(e);return}let i=this.st;if(i.active=r.active,r.active&&(i.wakeT+=e),i.windup=r.attacking&&r.cooldown<=r.stats.loadTime?1-r.cooldown/Math.max(.1,r.stats.loadTime):-1,r.lastAttack!==this.lastAttackSeen&&(this.lastAttackSeen=r.lastAttack,t-r.lastAttack<.2&&(i.sinceHit=0)),n){let t=this.inst.mesh,r=n.x-t.position.x,a=n.z-t.position.z,o=Math.atan2(r,a);i.aimYaw=yd(i.aimYaw,o-t.rotation.y,Math.min(1,e*8))}$u(this.inst,Rf(r.unit),i,e),this.flash=Math.max(0,this.flash-e*6),Od(this.mat,this.flash*.35,r.frozen&&r.stunTimer>0,r.stunTimer>0&&!r.frozen)}collapse(){this.down=!0,this.collapseT=0;let e=Lf(this.e.unit===`king`?`rubble-king`:`rubble-princess`,this.e.team);this.rubble=new J(e.geometry,new Oo({vertexColors:!0})),this.rubble.position.copy(this.inst.mesh.position),this.rubble.scale.setScalar(.3),this.rubble.castShadow=!0,this.rubble.receiveShadow=!0,this.parent.add(this.rubble)}animateCollapse(e){if(this.collapseT>=1)return;this.collapseT=Math.min(1,this.collapseT+e/.6);let t=this.collapseT,n=t*t*(3-2*t),r=this.inst.mesh;r.scale.set(1+n*.1,Math.max(.02,1-n*.96),1+n*.1),r.position.y=-n*.25,r.rotation.z=Math.sin(t*46)*.05*(1-t),t>=1&&(r.visible=!1),this.rubble?.scale.setScalar(.3+.7*Math.min(1,t*1.4))}dispose(){this.inst.mesh.removeFromParent(),this.inst.mesh.skeleton.dispose(),this.rubble?.removeFromParent(),(this.rubble?.material)?.dispose(),this.mat.dispose()}},om=new Map;function sm(e){let t=om.get(e);if(t)return t;let n=new wd;switch(n.addBone(`root`,-1,[0,0,0]),e){case`arrow`:case`tower-arrow`:n.cyl(.025,.025,.7,{rot:[Math.PI/2,0,0],color:`#8a5a2e`},5),n.cone(.06,.16,{at:[0,0,.42],rot:[Math.PI/2,0,0],color:`#cfd6de`},5),n.box(.12,.02,.14,{at:[0,0,-.3],color:e===`tower-arrow`?`#ffffff`:`#5fbf7a`});break;case`spear`:n.cyl(.03,.03,.9,{rot:[Math.PI/2,0,0],color:`#8a5a2e`},5),n.cone(.07,.2,{at:[0,0,.55],rot:[Math.PI/2,0,0],color:`#dfe5ec`},5);break;case`bomb`:n.sphere(.2,{color:`#2a2c33`},10),n.cyl(.03,.03,.12,{at:[0,.22,0],color:`#c9a24a`},5);break;case`cannonball`:case`king-ball`:n.sphere(e===`king-ball`?.24:.18,{color:`#30343b`},10);break;case`rocket`:n.cyl(.16,.16,1,{rot:[Math.PI/2,0,0],color:`#d8d0bc`},10),n.cone(.17,.4,{at:[0,0,.7],rot:[Math.PI/2,0,0],color:`#c0392b`},10);for(let e=0;e<4;e++){let t=e/4*Math.PI*2;n.box(.04,.3,.3,{at:[Math.cos(t)*.2,Math.sin(t)*.2,-.4],rot:[0,0,t],color:`#c0392b`})}break;case`barrel`:n.cyl(.38,.38,.7,{rot:[0,0,Math.PI/2],color:`#9a6834`},12),n.torus(.39,.04,{at:[.22,0,0],rot:[0,Math.PI/2,0],color:`#5a5f6b`},14),n.torus(.39,.04,{at:[-.22,0,0],rot:[0,Math.PI/2,0],color:`#5a5f6b`},14);break;case`log`:n.cyl(.38,.38,3.9,{rot:[0,0,Math.PI/2],color:`#8a5a2e`},12),n.cyl(.33,.33,.05,{at:[1.96,0,0],rot:[0,0,Math.PI/2],color:`#d9b77a`},12),n.cyl(.33,.33,.05,{at:[-1.96,0,0],rot:[0,0,Math.PI/2],color:`#d9b77a`},12);for(let e=0;e<6;e++)n.cone(.06,.25,{at:[-1.6+e*.65,.36,0],color:`#6b4426`},4);break;case`gsbomb`:n.sphere(.45,{color:`#2a2c33`},12),n.cyl(.05,.05,.2,{at:[0,.5,0],color:`#c9a24a`},5);break;default:n.sphere(.16,{color:`#ffffff`},8)}return t=n.build(1).geometry,t.userData.shared=!0,om.set(e,t),t}var cm={bullet:{color:`#fff2a8`,r:.11,trail:`spark`},fireball:{color:`#ff9a3a`,r:.3,trail:`fire`},fire:{color:`#ff8a2a`,r:.26,trail:`fire`},magic:{color:`#c86bff`,r:.24,trail:`magic`},ice:{color:`#bfe8ff`,r:.26,trail:`ice`},spit:{color:`#7fe0ff`,r:.14,trail:null}},lm=new go(1,10,8);lm.userData.shared=!0;var um=new Oo({vertexColors:!0}),dm=new Map;function fm(e){let t=cm[e];if(t){let n=dm.get(e);n||(n=new ia({color:t.color,transparent:!0,opacity:.95,blending:2,depthWrite:!1}),dm.set(e,n));let r=new J(lm,n);return r.scale.setScalar(t.r),r.userData.trail=t.trail,r}let n=new J(sm(e),um);return n.castShadow=!0,n.userData.trail=e===`bomb`?`spark`:e===`rocket`?`smoke`:null,n}function pm(e){return e.userData.trail??null}var mm=class{constructor(e=160){S(this,`cap`,void 0),S(this,`mesh`,void 0),S(this,`dummy`,new Ur),S(this,`n`,0),this.cap=e;let t=new ia({color:`#000000`,transparent:!0,opacity:.28,depthWrite:!1});this.mesh=new Va(new oo(1,16),t,e),this.mesh.rotation.set(0,0,0),this.mesh.renderOrder=1,this.mesh.frustumCulled=!1}begin(){this.n=0}add(e,t,n){this.n>=this.cap||(this.dummy.position.set(e,.04,t),this.dummy.rotation.set(-Math.PI/2,0,0),this.dummy.scale.set(n,n*.8,1),this.dummy.updateMatrix(),this.mesh.setMatrixAt(this.n++,this.dummy.matrix))}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0}};function hm(e){let t=d[e];return t?t.stats.half??t.stats.radius:1.4}var gm=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,_m=`
uniform sampler2D uMap;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverOn;
varying vec2 vUv;
void main() {
  vec2 grid = vec2(18.0, 32.0);
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * grid;
  vec2 cell = floor(p);
  float bad = texture2D(uMap, (cell + 0.5) / grid).r;
  vec2 f = fract(p);
  float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
  float line = 1.0 - smoothstep(0.02, 0.06, edge);
  vec4 col = vec4(0.0);
  if (bad > 0.5) {
    float stripe = step(0.5, fract((p.x + p.y) * 0.5 + uTime * 0.25));
    col = vec4(0.92, 0.18, 0.16, 0.28 + stripe * 0.08);
  } else {
    col = vec4(1.0, 1.0, 1.0, line * 0.32);
  }
  if (uHoverOn > 0.5 && cell == uHover) col = mix(col, vec4(1.0, 1.0, 1.0, 0.45), 0.7);
  gl_FragColor = col;
}`,vm=class{constructor(){S(this,`group`,new Wr),S(this,`tex`,void 0),S(this,`data`,new Uint8Array(2304)),S(this,`mat`,void 0),S(this,`plane`,void 0),S(this,`key`,``),S(this,`ghosts`,new Map),S(this,`activeGhosts`,[]),S(this,`spellDisc`,void 0),S(this,`spellRing`,void 0),S(this,`rangeRing`,void 0),S(this,`footprint`,void 0),S(this,`logPath`,void 0),this.tex=new ka(this.data,18,32,xt),this.tex.magFilter=et,this.tex.minFilter=et,this.tex.flipY=!1,this.mat=new Eo({uniforms:{uMap:{value:this.tex},uTime:{value:0},uHover:{value:[0,0]},uHoverOn:{value:0}},vertexShader:gm,fragmentShader:_m,transparent:!0,depthWrite:!1}),this.plane=new J(new mo(t.width,t.height),this.mat),this.plane.rotation.x=-Math.PI/2,this.plane.position.set(0,.035,0),this.plane.renderOrder=2,this.group.add(this.plane);let e=(e,t)=>new ia({color:e,transparent:!0,opacity:t,depthWrite:!1,side:2});this.spellDisc=new J(new oo(1,40),e(`#ffffff`,.22)),this.spellRing=new J(new ho(.94,1,48),e(`#ffffff`,.9)),this.rangeRing=new J(new ho(.96,1,64),e(`#ffffff`,.55)),this.footprint=new J(new mo(1,1),e(`#ffffff`,.3)),this.logPath=new J(new mo(1,1),e(`#ffffff`,.22));for(let e of[this.spellDisc,this.spellRing,this.rangeRing,this.footprint,this.logPath])e.rotation.x=-Math.PI/2,e.renderOrder=3,e.visible=!1,this.group.add(e);this.group.visible=!1}refresh(e,t,n){let r=f[n],i=e.entities.filter(e=>e.alive&&e.half>0).map(e=>e.id).join(`,`),a=e.towers(+(t===0)).filter(e=>!e.alive).length,o=`${t}|${r.unit&&d[r.unit].stats.tunnelSpeed?`tunnel`:r.kind}|${i}|${a}`;if(o===this.key)return;this.key=o;let s=r.kind===`building`?`knight`:n;for(let n=0;n<32;n++)for(let i=0;i<18;i++){let a=r.kind===`spell`||e.canDeployAt(t,s,i+.5,n+.5),o=(n*18+i)*4;this.data[o]=a?0:255,this.data[o+3]=255}this.tex.needsUpdate=!0}ghostSet(e,t){let n=this.ghosts.get(e);for(n||(n=[],this.ghosts.set(e,n));n.length<t;){let t=Dd({transparent:!0,opacity:.55,depthWrite:!1}),r=Td(Lf(e,0),t);r.mesh.castShadow=!1,r.mesh.renderOrder=8,this.group.add(r.mesh),n.push({inst:r,mat:t})}return n}update(e,t,n,r,i){let a=r?.cardId??n;this.group.visible=t&&!!a;for(let e of this.activeGhosts)e.inst.mesh.visible=!1;this.activeGhosts=[];for(let e of[this.spellDisc,this.spellRing,this.rangeRing,this.footprint,this.logPath])e.visible=!1;if(!this.group.visible||!a)return;let o=f[a];if(this.mat.uniforms.uTime.value=i,this.plane.visible=o.kind!==`spell`,o.kind!==`spell`&&this.refresh(e,0,a),this.mat.uniforms.uHoverOn.value=+!!r,!r)return;this.mat.uniforms.uHover.value=[Math.floor(r.x),Math.floor(r.y)];let s=r.legal?`#ffffff`:`#ff5a4a`,c=gd(r.x),l=_d(r.y);if(o.kind===`spell`){let e=o.spell;e.kind===`roll`?(this.logPath.visible=!0,this.logPath.scale.set(e.radius*2,e.rollRange,1),this.logPath.position.set(c,.06,l-e.rollRange/2),this.logPath.material.color.set(bd[0].light)):(this.spellDisc.visible=!0,this.spellRing.visible=!0,this.spellDisc.scale.setScalar(e.radius),this.spellRing.scale.setScalar(e.radius),this.spellDisc.position.set(c,.06,l),this.spellRing.position.set(c,.065,l),this.spellRing.material.color.set(bd[0].light));return}let u=d[o.unit],p=o.kind===`building`?[[0,0]]:A(o.count??1),m=this.ghostSet(u.id,p.length),h=Rf(u.id);if(p.forEach(([e,t],n)=>{let i=m[n];i.inst.mesh.visible=!0,i.inst.mesh.position.set(c+e,h.hover??0,l+t),i.inst.mesh.rotation.y=Math.PI,i.mat.emissive.set(r.legal?`#202020`:`#a01a10`),this.activeGhosts.push(i)}),o.kind===`building`){let e=u.stats.half??1;this.footprint.visible=!0,this.footprint.scale.set(e*2,e*2,1),this.footprint.position.set(c,.05,l),this.footprint.material.color.set(s)}let g=u.stats;if(g.projectile&&!g.kamikaze||o.kind===`building`&&g.range>0){this.rangeRing.visible=!0;let e=g.range+(g.half??g.radius);this.rangeRing.scale.setScalar(e),this.rangeRing.position.set(c,.07,l),this.rangeRing.material.color.set(s)}}},ym=new G;function bm(e,t){try{let n=document.createElement(`canvas`);return n.getContext(`webgl2`)??n.getContext(`webgl`)?new xm(e,t):null}catch{return null}}var xm=class{constructor(e,t){S(this,`kind`,`3d`),S(this,`preview`,null),S(this,`showZone`,!1),S(this,`selectedCard`,null),S(this,`hitStop`,0),S(this,`gl`,void 0),S(this,`stage`,void 0),S(this,`cam`,void 0),S(this,`arena`,void 0),S(this,`fx`,new Zp),S(this,`zone`,new vm),S(this,`shadows`,new mm),S(this,`overlay`,void 0),S(this,`layer`,new Wr),S(this,`units`,new Map),S(this,`towers`,new Map),S(this,`projs`,new Map),S(this,`shared`,new Set),S(this,`flights`,new Map),S(this,`areas`,new Map),S(this,`logs`,new Map),S(this,`bombs`,new Map),S(this,`beams`,new Map),S(this,`rain`,[]),S(this,`pendingSpawn`,new Map),S(this,`time`,0),S(this,`shakeAmp`,0),S(this,`cssW`,1),S(this,`cssH`,1),S(this,`k`,20),S(this,`left`,-9),S(this,`top`,13),S(this,`dpr`,1),S(this,`quality`,void 0),S(this,`frameAvg`,16),S(this,`slowFrames`,0),S(this,`lastGame`,null),S(this,`beamGeo`,new so(.09,.09,1,6,1,!0)),S(this,`poisonGeo`,new oo(1,40)),S(this,`poisonRingGeo`,new ho(.95,1,48)),S(this,`bombMat`,new Oo({vertexColors:!0,emissive:`#000000`})),S(this,`fireballGeo`,new go(.5,14,10)),S(this,`fireballCoreGeo`,new go(.3,10,8)),S(this,`fireballMat`,new ia({color:`#ff8a2a`})),S(this,`fireballCoreMat`,new ia({color:`#fff2a8`})),S(this,`fireballGlowMat`,new ia({color:`#ff5a1a`,transparent:!0,opacity:.45,blending:2,depthWrite:!1}));let n=typeof matchMedia==`function`&&matchMedia(`(pointer: coarse)`).matches;this.quality=n?`medium`:`high`,this.gl=tm(e,{antialias:!0}),this.stage=nm(this.gl,this.quality===`high`?2048:1024);let r=this.stage.scene;this.cam=new us(-10,10,14,-14,.1,200),this.cam.position.set(0,md*60,hd*60),this.cam.lookAt(0,0,0),this.arena=new Sp(this.gl),r.add(this.arena.group,this.layer,this.fx.group,this.zone.group,this.shadows.mesh),this.overlay=new $p(t),e.addEventListener(`webglcontextlost`,e=>e.preventDefault()),this.warmUp()}warmUp(){try{let e=new Wr,t=new im({id:-1,team:0,kind:`troop`,unit:`knight`,cardId:`knight`,facing:0,x:9,y:20,px:9,py:20},e);for(let t of[`arrow`,`fireball`,`bomb`])e.add(fm(t));this.stage.scene.add(e),this.gl.compile(this.stage.scene,this.cam),this.stage.scene.remove(e),t.dispose()}catch{}}projMesh(e){let t=fm(e);return this.noteShared(t),t}noteShared(e){e.traverse(e=>{let t=e.geometry;t?.userData.shared&&this.shared.add(t)})}get effectCount(){return this.fx.count+this.rain.filter(e=>e.t<1).length+this.flights.size+this.projs.size}get gpuStats(){this.noteShared(this.stage.scene);let e=0;this.stage.scene.traverse(t=>{t.isSkinnedMesh&&t.skeleton?.boneTexture&&e++});let t=this.gl.info;return{geometries:t.memory.geometries,shared:this.shared.size,textures:t.memory.textures,boneTextures:e,programs:t.programs?.length??0,calls:t.render.calls,triangles:t.render.triangles}}get qualityLevel(){return this.quality}get frameTime(){return this.frameAvg}resize(e,n){this.cssW=e,this.cssH=n;let r=this.quality===`high`?2:this.quality===`medium`?1.5:1;this.dpr=Math.min(window.devicePixelRatio||1,r),this.gl.setPixelRatio(this.dpr),this.gl.setSize(e,n,!0);let i=13.3,a=i-(-t.height/2*md-.15),o=Math.min(e/18.7,(n-58)/a),s=e/(2*o),c=Math.max(0,(n-58)/o-a),l=i+58/o+c*.55;this.k=o,this.left=-s,this.top=l,this.cam.left=-s,this.cam.right=s,this.cam.top=l,this.cam.bottom=l-n/o,this.cam.updateProjectionMatrix(),this.fx.setScale(o*this.dpr),this.arena.setScale(o*this.dpr),this.overlay.resize(e,n,this.dpr)}debugUnits(){return[...this.units.values()].map(e=>({unit:e.e.unit,opacity:e.mat.opacity,transparent:e.mat.transparent,dying:e.dyingT,emissive:e.mat.emissive.getHexString(),y:e.inst.mesh.position.y}))}debugView(e,t,n){let r=this.cssW/(2*this.k*n),i=this.cssH/(2*this.k*n),a=e-dd,o=-(t-fd)*md;this.left=a-r,this.top=o+i,this.k*=n,this.cam.left=a-r,this.cam.right=a+r,this.cam.top=o+i,this.cam.bottom=o-i,this.cam.updateProjectionMatrix(),this.fx.setScale(this.k*this.dpr),this.arena.setScale(this.k*this.dpr)}toWorld(e,t){let n=this.left+e/this.k,r=-(this.top-t/this.k)/md;return[n+dd,r+fd]}toScreen(e,t){return this.project(e-dd,0,t-fd)}project(e,t,n){let r=t*hd-n*md;return[(e-this.left)*this.k,(this.top-r)*this.k]}setArenaTheme(e){this.arena.setTheme(e);let t=gp[Cp(e)].light,{hemi:n,sun:r,scene:i}=this.stage;n.color.set(t.sky),n.groundColor.set(t.ground),n.intensity=t.hemi,r.color.set(t.sun),r.intensity=t.sunI,i.background.set(t.bg)}reset(){for(let e of this.units.values())e.dispose();for(let e of this.towers.values())e.dispose();this.units.clear(),this.towers.clear();for(let e of this.projs.values())e.mesh.removeFromParent();this.projs.clear();for(let e of this.flights.values())e.group.removeFromParent();this.flights.clear();for(let e of this.areas.values())this.disposeArea(e);this.areas.clear();for(let e of this.logs.values())e.removeFromParent();this.logs.clear();for(let e of this.bombs.values())this.disposeMesh(e);this.bombs.clear();for(let e of this.beams.values())this.disposeMesh(e);this.beams.clear();for(let e of this.rain)e.mesh.removeFromParent();this.rain=[],this.pendingSpawn.clear(),this.fx.clear(),this.overlay.floats=[],this.preview=null,this.showZone=!1,this.selectedCard=null,this.shakeAmp=0,this.hitStop=0,this.lastGame=null}shake(e){this.shakeAmp=Math.min(.6,Math.max(this.shakeAmp,e))}stop(e){this.hitStop=Math.max(this.hitStop,e)}pushEvents(e,t){let n=this.fx;for(let r of e)switch(r.type){case`spawn`:this.pendingSpawn.set(r.id,r.source);break;case`deploy`:{let e=f[r.cardId],t=gd(r.x),i=_d(r.y);e.kind!==`spell`&&(n.ring(t,i,.3,e.kind===`building`?1.8:1.3,bd[r.team].light,.5),n.burst(`dust`,t,0,i,e.kind===`building`?1.3:.8),(d[e.unit].stats.mass>=18||e.kind===`building`)&&this.shake(.08)),r.team===0&&(this.overlay.addFloat(t,i,`-${r.cost}`,`#ff8ff0`,20,1),n.burst(`elixir`,t,.2,i,1,8));break}case`attack`:{let e=this.units.get(r.targetId);if(r.ranged)(r.unit===`musketeer`||r.unit===`cannon`||r.unit===`king`)&&n.burst(`smoke`,gd(r.x),r.unit===`king`?3.2:.9,_d(r.y),.4,3);else{let t=gd(r.tx),i=_d(r.ty),a=e?e.hover+.6:.8,o=[`giant`,`golem`,`golemite`,`giant_skeleton`,`iron_swordsman`,`lancer`,`bomb_blimp`].includes(r.unit);n.burst(`spark`,t,a,i,o?1.3:.7,o?12:6),o&&(n.ring(t,i,.2,1.1,`#fff2c8`,.3,.7),this.shake(r.charge?.14:.06),this.stop(r.charge?.07:.035)),r.unit===`axe_dwarf`&&n.ring(gd(r.x),_d(r.y),.4,2.1,`#ffffff`,.35,.6),r.unit===`bomb_blimp`&&(n.burst(`fire`,t,.4,i,1.2),n.burst(`smoke`,t,.3,i,1),n.ring(t,i,.3,1.4,`#ffb347`,.4))}break}case`hit`:{let e=this.units.get(r.id);e&&(e.flash=1);let t=this.towers.get(r.id);t&&(t.flash=1,r.amount>=150&&n.burst(`debris`,gd(r.x),1.6,_d(r.y),.4,3)),r.amount>=500&&!r.isTower&&this.stop(.04);break}case`impact`:{let e=gd(r.x),t=_d(r.y);switch(r.visual){case`bomb`:n.burst(`fire`,e,.3,t,r.radius*.7),n.burst(`smoke`,e,.3,t,r.radius*.6),n.ring(e,t,.2,r.radius,`#ffd36b`,.35),n.decal(e,t,r.radius*.6,`#2a2218`,2.5),this.shake(.05);break;case`fireball`:case`fire`:n.burst(`fire`,e,.5,t,r.radius*.6),n.ring(e,t,.2,r.radius,`#ffb347`,.3,.7);break;case`magic`:n.burst(`magic`,e,.5,t,r.radius),n.ring(e,t,.2,r.radius,`#c86bff`,.3,.7);break;case`ice`:n.burst(`ice`,e,.4,t,r.radius*.8,18),n.ring(e,t,.2,r.radius,`#bfe8ff`,.4,.9);break;default:n.burst(`spark`,e,.5,t,.6,5)}break}case`death`:{let e=this.units.get(r.id);if(e&&(r.kamikaze?(e.dispose(),this.units.delete(r.id)):e.dyingT<0&&(e.dyingT=0)),r.kamikaze&&r.unit===`siege_ram`&&(n.burst(`splinter`,gd(r.x),.5,_d(r.y),1.2,22),n.burst(`dust`,gd(r.x),0,_d(r.y),1.2,14),this.shake(.08)),r.kind!==`tower`){let t=gd(r.x),i=_d(r.y),a=d[r.unit]?.stats.mass>=18;r.kamikaze||n.burst(`smoke`,t,(e?.hover??0)+.3,i,a?1.4:.6,a?12:5),r.kind===`building`&&(n.burst(`debris`,t,.5,i,1,14),this.shake(.06))}break}case`towerDown`:{let e=gd(r.x),t=_d(r.y),i=r.isKing?1.6:1.2;n.flash(e,1.6,t,.8,3*i,`#ffe2a0`,.42),n.burst(`fire`,e,1.6,t,1.6*i,36),n.burst(`debris`,e,1.2,t,1.4*i,36),n.burst(`smoke`,e,1,t,1.6*i,12),n.ring(e,t,.5,3.4*i,`#ffd36b`,.7),n.decal(e,t,1.9*i,`#3a2e22`,6),this.shake(r.cascade?.3:.45),this.stop(r.cascade?.05:.14);let a=[...this.towers.values()].find(e=>e.e.x===r.x&&e.e.y===r.y);a&&!a.down&&a.collapse();break}case`emerge`:{let e=gd(r.x),t=_d(r.y),i=this.units.get(r.id);i&&(i.popT=0,i.inst.mesh.visible=!0),n.burst(`dust`,e,0,t,1.3,22),n.burst(`debris`,e,.2,t,.9,12),n.ring(e,t,.3,1.4,`#b8956a`,.45),this.shake(.05);break}case`elixir`:{let e=gd(r.x),t=_d(r.y);this.overlay.addFloat(e,t,`+${r.amount}`,`#ff8ff0`,24,1.3),n.burst(`elixir`,e,1.3,t,1,12);break}case`strike`:{let e=gd(r.x),t=_d(r.y);n.bolt(e,t,`#e2d6ff`),n.bolt(e+.15,t,`#ffffff`),n.flash(e,.8,t,.3,1.5,`#efe6ff`,.24),n.ring(e,t,.3,1.5,`#c9b8ff`,.35),n.burst(`stun`,e,.4,t,1,12),this.shake(.1),this.stop(.04);break}case`spellCast`:if(r.cardId===`lightning`){let e=gd(r.x),t=_d(r.y);n.burst(`smoke`,e,6.4,t,2.6,26),n.ring(e,t,.4,3.5,`#b9a8ff`,.6,.6)}if(r.cardId===`rage`){let e=gd(r.x),t=_d(r.y);n.ring(e,t,.4,3,`#ff6a88`,.5),n.burst(`rage`,e,.1,t,2.4,30)}break;case`kingActivate`:{let e=t.king(r.team);n.burst(`spark`,gd(e.x),3.2,_d(e.y),1.2,14);break}case`spell`:this.spellImpact(r.cardId,r.x,r.y,r.radius,r.wave);break;case`blast`:{let e=gd(r.x),t=_d(r.y);r.visual===`bomb`?(n.flash(e,.5,t,.3,r.radius*.95,`#ffc65a`,.26),n.burst(`fire`,e,.4,t,r.radius*.8,40),n.burst(`smoke`,e,.4,t,r.radius*.7,18),n.burst(`debris`,e,.3,t,r.radius*.5,12),n.ring(e,t,.3,r.radius,`#ffd36b`,.5),n.decal(e,t,r.radius*.7,`#1f1a14`,5),this.shake(.3),this.stop(.08)):(n.burst(`dust`,e,0,t,r.radius,26),n.burst(`debris`,e,.3,t,r.radius*.6,16),n.ring(e,t,.4,r.radius,`#e8d9b8`,.5),this.shake(.18));break}case`charge`:{let e=this.units.get(r.id);e&&n.burst(`dust`,e.x,0,e.z,1,10);break}case`stun`:{let e=this.units.get(r.id);e&&n.burst(r.freeze?`ice`:`stun`,e.x,e.hover+e.height*.9,e.z,.6,r.freeze?8:6);break}}}spellImpact(e,t,n,r,i){let a=this.fx,o=gd(t),s=_d(n);switch(e){case`fireball`:a.flash(o,.6,s,.4,r*1.05,`#ffb347`,.3),a.burst(`fire`,o,.5,s,r*.75,70),a.burst(`smoke`,o,.6,s,r*.6,18),a.burst(`spark`,o,.5,s,1.5,16),a.ring(o,s,.3,r,`#ffb347`,.45),a.decal(o,s,r*.75,`#1f1a14`,4),this.shake(.16),this.stop(.05);break;case`rocket`:a.flash(o,.7,s,.5,r*1.35,`#ffd36b`,.36),a.burst(`fire`,o,.5,s,r*1.1,80),a.burst(`smoke`,o,.6,s,r,24),a.burst(`debris`,o,.4,s,r*.6,18),a.ring(o,s,.3,r*1.3,`#ffd36b`,.55),a.decal(o,s,r*.9,`#1a1510`,6),this.shake(.3),this.stop(.09);break;case`arrows`:this.arrowRain(o,s,r);break;case`zap`:for(let e=0;e<4;e++){let t=e/4*Math.PI*2+Math.random(),n=e===0?0:r*(.3+Math.random()*.5);a.bolt(o+Math.cos(t)*n,s+Math.sin(t)*n)}a.ring(o,s,.4,r,`#8fdcff`,.35,.9),a.burst(`stun`,o,.3,s,1,16),this.shake(.06);break;case`freeze`:a.flash(o,.8,s,.4,r*.9,`#a8e8ff`,.3,.7),a.burst(`ice`,o,.5,s,r*.8,50),a.ring(o,s,.4,r,`#bfefff`,.6),a.decal(o,s,r*.95,`#d8f4ff`,4.2),this.shake(.05);break;case`goblin_barrel`:a.burst(`splinter`,o,.4,s,1,16),a.burst(`dust`,o,0,s,1.2,12),a.ring(o,s,.3,1.6,`#e8d9b8`,.4),this.shake(.05);break;case`poison`:i===0&&a.burst(`poison`,o,.1,s,r,10)}}arrowRain(e,t,n){for(let r=0;r<9;r++){let r=Math.random()*Math.PI*2,i=Math.sqrt(Math.random())*n*.9,a=this.rain.find(e=>e.t>=1);if(!a){if(this.rain.length>60)break;let e=this.projMesh(`arrow`);this.layer.add(e),a={mesh:e,t:1,x:0,z:0,dx:0},this.rain.push(a)}a.t=-Math.random()*.12,a.x=e+Math.cos(r)*i,a.z=t+Math.sin(r)*i,a.dx=(Math.random()-.5)*.6,a.mesh.visible=!1}this.fx.burst(`dust`,e,0,t,n*.5,14)}render(e,t,n){this.lastGame!==e&&(this.reset(),this.lastGame=e),this.time+=n;let r=this.hitStop>0?n*.12:n;this.hitStop=Math.max(0,this.hitStop-n),this.trackPerformance(n),this.arena.update(this.time);let i=new Set;for(let a of e.entities){if(a.kind===`tower`){let t=this.towers.get(a.id);t||(t=new am(a,this.layer),this.noteShared(t.inst.mesh),this.towers.set(a.id,t));let i=a.alive&&a.targetId>=0?e.get(a.targetId):void 0;if(t.update(r,e.time,i?ym.set(gd(i.x),0,_d(i.y)):null),t.rubble&&this.shared.add(t.rubble.geometry),a.alive&&n>0){let e=a.hp/a.maxHp,t=a.unit===`king`?3.3:2.9;e<.5&&Math.random()<n*(e<.25?9:4)&&this.fx.trail(`smoke`,gd(a.x)+(Math.random()-.5)*1.6,t,_d(a.y)+(Math.random()-.5)*1.2),e<.25&&Math.random()<n*10&&this.fx.trail(`fire`,gd(a.x)+(Math.random()-.5)*1.4,t-.3,_d(a.y)+(Math.random()-.5)*1)}continue}if(!a.alive)continue;i.add(a.id);let o=this.units.get(a.id);if(!o){o=new im(a,this.layer),this.noteShared(o.inst.mesh);let e=this.pendingSpawn.get(a.id);e===`tunnel`?o.inst.mesh.visible=!1:e===`card`||e===`barrel`?o.dropT=0:(e===`spawner`||e===`death`)&&(o.popT=0),this.pendingSpawn.delete(a.id),this.units.set(a.id,o)}if(a.kind===`building`&&a.targetId>=0){let t=e.get(a.targetId);if(t){let e=Math.atan2(gd(t.x)-o.x,_d(t.y)-o.z);o.st.aimYaw=e-o.yaw}}o.update(t,n,r,e.time),a.tunneling&&(o.inst.mesh.visible=!1,n>0&&Math.random()<.8&&this.fx.burst(`dust`,o.x,0,o.z,.45,2),n>0&&Math.random()<.15&&this.fx.burst(`debris`,o.x,.05,o.z,.3,1)),this.updateBeam(a,o,e),a.charging&&Math.random()<.5&&this.fx.trail(`smoke`,o.x,.1,o.z)}for(let[a,o]of this.units)i.has(a)||(o.dyingT<0&&(o.dyingT=0),o.update(t,n,r,e.time),o.done&&(o.dispose(),this.units.delete(a),this.removeBeam(a)));this.syncProjectiles(e),this.syncSpells(e,n),this.updateRain(n),this.zone.update(e,this.showZone,this.selectedCard,this.preview,this.time),this.shadows.begin();for(let e of this.units.values())e.e.tunneling||(e.hover>0||this.quality===`low`)&&this.shadows.add(e.x,e.z,hm(e.e.unit)*(e.hover>0?.9:1.1));this.shadows.end(),this.fx.update(n);let a=0,o=0;this.shakeAmp>.001&&(a=(Math.random()-.5)*this.shakeAmp,o=(Math.random()-.5)*this.shakeAmp,this.shakeAmp*=.02**n),this.cam.position.set(a,md*60+o*hd,hd*60-o*md),this.gl.render(this.stage.scene,this.cam),this.drawOverlay(e,n)}updateBeam(e,t,n){if(e.unit!==`inferno`)return;let r=e.attacking&&e.targetId>=0?n.get(e.targetId):void 0,i=this.beams.get(e.id);if(!r||e.stunTimer>0){i&&(i.visible=!1);return}i||(i=new J(this.beamGeo,new ia({color:`#ff8a2a`,transparent:!0,blending:2,depthWrite:!1})),i.renderOrder=7,this.layer.add(i),this.beams.set(e.id,i));let a=Math.min(2,Math.floor(e.rampTime/(e.stats.ramp?.stageTime??2))),o=this.units.get(r.id),s=new G(t.x,1.8,t.z),c=new G(gd(r.x),o?o.hover+.6:r.kind===`tower`?1.5:.6,_d(r.y)),l=c.clone().sub(s),u=l.length();i.visible=!0,i.position.copy(s),i.quaternion.setFromUnitVectors(new G(0,1,0),l.normalize());let d=.7+a*.7+Math.sin(this.time*40)*.15;i.scale.set(d,u,d),i.position.addScaledVector(l,u/2),i.material.color.set(a===0?`#ffb347`:a===1?`#ff7a2a`:`#ff3a1a`),Math.random()<.4&&this.fx.trail(`fire`,c.x,c.y,c.z)}removeBeam(e){let t=this.beams.get(e);t&&(this.disposeMesh(t),this.beams.delete(e))}disposeMesh(e){e.removeFromParent(),e.material.dispose()}disposeArea(e){e.removeFromParent();for(let t of e.children)t.material.dispose()}heightOfSource(e){if(e===`princess`)return 3.6;if(e===`king`)return 2.95;let t=d[e];return t?t.stats.flying?(e===`baby_dragon`?1.4:1)+.5:t.stats.half?.9:.8:.8}syncProjectiles(e){let t=new Set;for(let n of e.projectiles){if(n.done)continue;t.add(n.id);let r=this.projs.get(n.id);if(!r){let e=this.projMesh(n.visual);this.layer.add(e);let t=Math.max(.1,Math.hypot(n.tx-n.sx,n.ty-n.sy)),i=0,a=0;if(n.source===`king`){let e=n.team===1?1:-1;i=((n.tx-n.sx)*e>=0?1:-1)*1.38*e,a=1.88*e}r={mesh:e,sx:n.sx,sz:n.sy,sh:this.heightOfSource(n.source),total:t,last:new G(gd(n.x)+i,1,_d(n.y)+a),ox:i,oz:a},this.projs.set(n.id,r)}let i=e.get(n.targetId),a=i?i.stats.flying?1.5:i.kind===`tower`?1.6:.6:.4,o=Math.hypot(n.x-n.sx,n.y-n.sy),s=Math.min(1,o/Math.max(.1,o+Math.hypot(n.tx-n.x,n.ty-n.y))),c=r.sh+(a-r.sh)*s+n.arc*4*s*(1-s),l=new G(gd(n.x)+r.ox*(1-s),c,_d(n.y)+r.oz*(1-s)),u=l.clone().sub(r.last);r.mesh.position.copy(l),u.lengthSq()>1e-6&&r.mesh.lookAt(l.clone().add(u)),r.last.copy(l);let d=pm(r.mesh);d&&this.fx.trail(d,l.x,l.y,l.z)}for(let[e,n]of this.projs)t.has(e)||(n.mesh.removeFromParent(),this.projs.delete(e))}syncSpells(e,t){let n=new Set;for(let r of e.spells){if(r.delay<=0)continue;n.add(r.id);let e=this.flights.get(r.id);if(!e){let t=new Wr,n=[];if(r.cardId===`fireball`){let e=new J(this.fireballGeo,this.fireballMat);e.add(new J(this.fireballCoreGeo,this.fireballCoreMat));let t=new J(this.fireballGeo,this.fireballGlowMat);t.scale.setScalar(1.75),t.name=`glow`,e.add(t),n.push(e)}else if(r.cardId===`rocket`)n.push(this.projMesh(`rocket`));else if(r.cardId===`goblin_barrel`)n.push(this.projMesh(`barrel`));else if(r.cardId===`arrows`)for(let e=0;e<10;e++){let e=this.projMesh(`arrow`);e.userData.off=[(Math.random()-.5)*2.6,(Math.random()-.5)*.8,(Math.random()-.5)*2.2],n.push(e)}for(let e of n)t.add(e);this.layer.add(t),e={group:t,meshes:n,cardId:r.cardId},this.flights.set(r.id,e)}let i=1-r.delay/Math.max(1e-4,r.totalDelay),a=gd(r.fromX),o=_d(r.fromY),s=gd(r.x),c=_d(r.y),l=r.cardId===`rocket`?7:r.cardId===`arrows`?4.5:5,u=e=>new G(a+(s-a)*e,3.2*(1-e)+.3+l*4*e*(1-e),o+(c-o)*e),d=u(i),f=u(Math.min(1,i+.02));for(let n of e.meshes){let e=n.userData.off;n.position.set(d.x+(e?.[0]??0)*i,d.y+(e?.[1]??0),d.z+(e?.[2]??0)*i),r.cardId===`goblin_barrel`?n.rotation.x+=t*9:n.lookAt(f.x+(e?.[0]??0)*i,f.y+(e?.[1]??0),f.z+(e?.[2]??0)*i)}if(r.cardId===`fireball`){for(let e=0;e<3;e++)this.fx.trail(`fire`,d.x,d.y,d.z);this.fx.trail(`smoke`,d.x,d.y+.1,d.z),Math.random()<.5&&this.fx.trail(`spark`,d.x,d.y,d.z);let n=e.meshes[0].getObjectByName(`glow`);n&&n.scale.setScalar(1.6+Math.sin(this.time*30)*.18),e.meshes[0].rotation.z+=t*6}else r.cardId===`rocket`&&(this.fx.trail(`smoke`,d.x,d.y,d.z),this.fx.trail(`fire`,d.x,d.y,d.z))}for(let[e,t]of this.flights)n.has(e)||(t.group.removeFromParent(),this.flights.delete(e));let r=new Set;for(let t of e.areas){r.add(t.id);let e=this.areas.get(t.id);if(!e){e=new Wr;let n=t.cardId===`rage`,r=new J(this.poisonGeo,new ia({color:n?`#ff4a6a`:`#8fd14f`,transparent:!0,opacity:.25,depthWrite:!1,side:2})),i=new J(this.poisonRingGeo,new ia({color:n?`#ffa0b4`:`#d6ff8a`,transparent:!0,opacity:.7,depthWrite:!1,side:2}));for(let t of[r,i])t.rotation.x=-Math.PI/2,t.renderOrder=3,e.add(t);e.scale.setScalar(t.radius),e.position.set(gd(t.x),.07,_d(t.y)),this.layer.add(e),this.areas.set(t.id,e)}let n=Math.min(1,t.timeLeft/.5),i=e.children[0];i.material.opacity=(.2+Math.sin(this.time*4)*.05)*n,e.children[1].material.opacity=.7*n,Math.random()<.6&&this.fx.burst(t.cardId===`rage`?`rage`:`poison`,gd(t.x),.05,_d(t.y),t.radius,1)}for(let[e,t]of this.areas)r.has(e)||(this.disposeArea(t),this.areas.delete(e));let i=new Set;for(let t of e.rollers){i.add(t.id);let e=this.logs.get(t.id);e||(e=this.projMesh(`log`),this.layer.add(e),this.logs.set(t.id,e)),e.position.set(gd(t.x),.38,_d(t.y)),e.rotation.set(t.traveled/.38*t.dir,0,0),Math.random()<.8&&this.fx.burst(`dust`,gd(t.x)+(Math.random()-.5)*3.6,0,_d(t.y),.5,1)}for(let[e,t]of this.logs)i.has(e)||(this.fx.burst(`splinter`,t.position.x,.4,t.position.z,1,12),t.removeFromParent(),this.logs.delete(e));let a=new Set;for(let t of e.bombs){a.add(t.id);let e=this.bombs.get(t.id);e||(e=this.projMesh(`gsbomb`),e.material=this.bombMat.clone(),e.scale.setScalar(t.unit===`bomb_blimp`?.6:1),this.layer.add(e),this.bombs.set(t.id,e));let n=1-t.timer/Math.max(.01,t.total),r=t.unit===`bomb_blimp`?Math.max(0,1-n*2.2)*2.4:0;e.position.set(gd(t.x),.45+r,_d(t.y));let i=Math.sin(this.time*(8+n*30))>0?.6*n+.2:0;e.material.emissive.setRGB(i,i*.15,0),Math.random()<.5&&this.fx.trail(`spark`,e.position.x,e.position.y+.55,e.position.z)}for(let[e,t]of this.bombs)a.has(e)||(this.disposeMesh(t),this.bombs.delete(e))}updateRain(e){for(let t of this.rain){if(t.t>=1||(t.t+=e/.22,t.t<0))continue;let n=Math.min(1,t.t);t.mesh.visible=n<1;let r=4.5*(1-n)+.1;t.mesh.position.set(t.x+t.dx*(1-n),r,t.z-(1-n)*1.2),t.mesh.lookAt(t.x,-1,t.z+.3),n>=1&&(t.t=1,t.mesh.visible=!1,this.fx.burst(`dust`,t.x,0,t.z,.3,2))}}drawOverlay(e,t){let n=this.overlay;n.begin();let r=this.k;for(let e of this.units.values()){if(e.dyingT>=0||e.e.tunneling)continue;let t=e.e,i=e.hover+e.height*e.scale+.2,[a,o]=this.project(e.x,i,e.z);if(t.deployTimer>0){n.deployTimer(a,o-4,Math.max(6,r*.32),1-t.deployTimer/Math.max(.3,t.stats.deployTime),t.team);continue}let s=t.kind===`building`;if(t.hp<t.maxHp-.5||s){let e=Math.max(18,Math.min(60,r*(s?1.9:Math.max(.9,hm(t.unit)*2))));n.unitBar(a,o,e,t.hp/t.maxHp,t.team,!0)}}for(let e of this.towers.values()){let t=e.e;if(!t.alive)continue;let i=t.unit===`king`,[a,o]=this.project(gd(t.x),e.height+(i?.35:.2),_d(t.y)),s=r*(i?3:2.4);n.towerBar(a,o,s,t.hp,t.hp/t.maxHp,t.team,i,Math.max(.8,r/20))}if(n.drawFloats(t,(e,t)=>this.project(e,1.2,t)),e.playing&&e.timeLeft<=10&&e.timeLeft>0){let t=Math.ceil(e.timeLeft);n.bigCountdown(t,e.timeLeft-Math.floor(e.timeLeft))}}trackPerformance(e){e<=0||e>.25||(this.frameAvg=this.frameAvg*.95+e*1e3*.05,this.frameAvg>38?this.slowFrames++:this.slowFrames=Math.max(0,this.slowFrames-2),this.slowFrames>150&&this.quality!==`low`&&(this.quality=this.quality===`high`?`medium`:`low`,this.slowFrames=0,this.frameAvg=16,this.quality===`low`?(this.gl.shadowMap.enabled=!1,this.stage.sun.castShadow=!1,this.arena.ambience.enabled=!1):(this.stage.sun.shadow.mapSize.set(1024,1024),this.stage.sun.shadow.map?.dispose(),this.stage.sun.shadow.map=null),this.resize(this.cssW,this.cssH)))}dispose(){this.reset(),this.gl.dispose()}};function Sm(e){if(e.kind===`spell`){let t=e.spell,n=[`法術`];return t.stun&&n.push(`暈眩`),t.pushback&&n.push(`擊退`),t.kind===`area`&&n.push(`持續`),t.spawn&&n.push(`召喚`),t.hitsAir||n.push(`只打地面`),n}let t=d[e.unit].stats,n=[];return e.kind===`building`?n.push(`建築`):t.flying?n.push(`飛行`):t.targets===`buildings`?n.push(`只打建築`):n.push(t.projectile&&!t.kamikaze?`遠程`:`近戰`),(t.splash||t.projectile?.splash)&&n.push(`範圍`),e.kind!==`building`&&t.targets===`air-ground`&&!t.flying&&n.push(`可打空中`),(e.count??1)>1&&n.push(`×${e.count}`),n}var Cm={common:`普通`,rare:`稀有`,epic:`史詩`,legendary:`傳奇`};function wm(e){return Cm[e]??e}function Tm(e,t){let n=t?f[t]:void 0;if(e.classList.remove(`r-common`,`r-rare`,`r-epic`,`r-legendary`),!n){e.innerHTML=``,delete e.dataset.card,e.removeAttribute(`aria-label`);return}e.classList.add(`r-${n.rarity}`),e.dataset.card=n.id,e.setAttribute(`aria-label`,`${n.name}，${n.cost} 能量`);let r=zp.get(n.id);e.innerHTML=`${r?`<img class="card-img" src="${r}" alt="" draggable="false" />`:`<span class="card-glyph">${n.glyph}</span>`}<span class="cost"><b>${n.cost}</b></span><span class="card-name">${n.name}</span><span class="fill"></span>`}function Em(e=document){e.querySelectorAll(`.card[data-card]`).forEach(e=>{let t=e.dataset.card,n=zp.get(t);if(!n)return;let r=e.querySelector(`.card-glyph`);if(r){let e=document.createElement(`img`);e.className=`card-img`,e.src=n,e.alt=``,e.draggable=!1,r.replaceWith(e)}})}function Dm(e){return e.length===0?0:e.reduce((e,t)=>e+(f[t]?.cost??0),0)/e.length}function Om(){return`<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M2 17 L3.5 5 L8.5 10 L12 2 L15.5 10 L20.5 5 L22 17 Z" /><rect x="2" y="16.5" width="20" height="3" rx="1" /></svg>`}function km(e,t,n){if(e.childElementCount!==t){e.innerHTML=``;for(let n=0;n<t;n++){let t=document.createElement(`i`);t.className=`crown-i`,t.innerHTML=Om(),e.appendChild(t)}}Array.from(e.children).forEach((e,t)=>{let r=e.classList.contains(`on`),i=t<n;e.classList.toggle(`on`,i),i&&!r&&(e.classList.remove(`pop`),e.offsetWidth,e.classList.add(`pop`))})}function Am(){return`${location.origin}${location.pathname}`}function jm(){if(typeof navigator.share!=`function`)return!1;try{return window.matchMedia(`(pointer: coarse)`).matches}catch{return!1}}async function Mm(e){let t=Am();if(jm())try{return await navigator.share({title:document.title,text:e,url:t}),`shared`}catch(e){if(e?.name===`AbortError`)return`cancelled`}if(navigator.clipboard&&window.isSecureContext)try{return await navigator.clipboard.writeText(t),`copied`}catch{}return`manual`}var Z=e=>document.getElementById(e);function Nm(e){let t=Math.max(0,Math.ceil(e));return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}var Pm={easy:`簡單`,normal:`普通`,hard:`困難`},Fm={king:e=>e===0?`你推倒了對方的國王塔！`:`我方國王塔被推倒了`,time:()=>`時間到，皇冠較多的一方獲勝`,overtime:()=>`延長賽中率先推倒塔的一方獲勝`,tiebreak:()=>`延長賽結束：塔同步扣血，最低血量的塔先倒`,draw:()=>`延長賽結束，雙方塔血量相同`},Im=[{id:`good`,em:`👍`,text:`讚！`},{id:`haha`,em:`😆`,text:`哈哈`},{id:`wow`,em:`😮`,text:`哇！`},{id:`thanks`,em:`🙏`,text:`謝謝`},{id:`grr`,em:`😤`,text:`可惡`},{id:`luck`,em:`🍀`,text:`祝好運`}],Lm=1.7,Rm=.62,zm=class{constructor(t,n){S(this,`sound`,void 0),S(this,`host`,void 0),S(this,`game`,void 0),S(this,`ai`,void 0),S(this,`renderer`,void 0),S(this,`raf`,0),S(this,`active`,!1),S(this,`paused`,!1),S(this,`intro`,0),S(this,`introStep`,-1),S(this,`last`,0),S(this,`acc`,0),S(this,`selected`,null),S(this,`drag`,null),S(this,`endAt`,0),S(this,`resultShown`,!1),S(this,`deck`,[]),S(this,`level`,`normal`),S(this,`aiDeckName`,``),S(this,`aiDeckCards`,[]),S(this,`plays`,{}),S(this,`seed`,0),S(this,`handKey`,``),S(this,`hudKey`,``),S(this,`toastTimer`,0),S(this,`bannerTimer`,0),S(this,`sizeW`,0),S(this,`sizeH`,0),S(this,`fullShown`,!1),S(this,`stepsRun`,0),S(this,`skipIntro`,!1),S(this,`coach`,!1),S(this,`coachStep`,0),S(this,`coachT`,0),S(this,`coachEl`,Z(`coach`)),S(this,`coachHand`,Z(`coach-hand`)),S(this,`coachRing`,Z(`coach-ring`)),S(this,`coachTip`,Z(`coach-tip`)),S(this,`root`,Z(`screen-battle`)),S(this,`wrap`,Z(`arena-wrap`)),S(this,`canvas`,Z(`arena`)),S(this,`uiCanvas`,Z(`arena-ui`)),S(this,`panel`,Z(`hand-panel`)),S(this,`handEl`,Z(`hand`)),S(this,`cards`,Array.from(document.querySelectorAll(`#hand .card`))),S(this,`nextCard`,Z(`next-card`)),S(this,`elixirNum`,Z(`elixir-num`)),S(this,`elixirFill`,Z(`elixir-fill`)),S(this,`elixirFull`,Z(`elixir-full`)),S(this,`elixirBox`,this.panel.querySelector(`.elixir`)),S(this,`timer`,Z(`hud-timer`)),S(this,`timeBox`,Z(`hud-time-box`)),S(this,`timeLabel`,Z(`hud-time-label`)),S(this,`mult`,Z(`hud-mult`)),S(this,`multText`,Z(`hud-mult-text`)),S(this,`crownsMe`,Z(`hud-crowns-me`)),S(this,`crownsEnemy`,Z(`hud-crowns-enemy`)),S(this,`nameEnemy`,Z(`hud-name-enemy`)),S(this,`toastEl`,Z(`toast`)),S(this,`bannerEl`,Z(`banner`)),S(this,`countdownEl`,Z(`countdown`)),S(this,`ovVs`,Z(`ov-vs`)),S(this,`ovPause`,Z(`ov-pause`)),S(this,`ovResult`,Z(`ov-result`)),S(this,`handSlots`,[null,null,null,null]),S(this,`emotePicker`,Z(`emote-picker`)),S(this,`emoteMe`,Z(`emote-me`)),S(this,`emoteEnemy`,Z(`emote-enemy`)),S(this,`emoteTimers`,[]),S(this,`lastEnemyEmote`,-99),S(this,`shownCrowns`,[0,0]),S(this,`arenaTheme`,0),S(this,`arenaName`,``),S(this,`playerTrophies`,0),S(this,`landscape`,null),S(this,`frame`,t=>{if(!this.active)return;this.raf=requestAnimationFrame(this.frame);let n=Math.min(.1,Math.max(0,(t-this.last)/1e3));this.last=t;let r=this.game;this.intro>0&&!this.paused&&this.updateIntro(n);let i=this.renderer.hitStop??0;if(!this.paused&&this.intro<=0&&r.phase!==`ended`&&i<=0){for(this.acc+=n;this.acc>=e;)if(this.simStep(),this.acc-=e,this.ended){this.acc=0;break}}this.renderer.render(r,this.paused?1:Math.min(1,this.acc/e),this.paused?0:n),this.updateHud(),this.updateCoach(n),this.endAt&&t>=this.endAt&&!this.resultShown&&this.showResult()}),this.sound=t,this.host=n;let r=new URLSearchParams(location.search).get(`render`)===`2d`?null:bm(this.canvas,this.uiCanvas);this.renderer=r??new Be(this.canvas),r||(this.uiCanvas.hidden=!0),this.bindInput(),this.bindButtons();let i=typeof ResizeObserver==`function`?new ResizeObserver(()=>this.layout()):null;i&&i.observe(this.wrap),window.addEventListener(`resize`,()=>{this.layout(),this.checkOrientation()}),document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`&&this.autoPause()}),this.landscape=typeof window.matchMedia==`function`?window.matchMedia(`(orientation: landscape) and (max-height: 520px) and (pointer: coarse)`):null,this.landscape?.addEventListener?.(`change`,()=>this.checkOrientation()),window.addEventListener(`pagehide`,()=>this.autoPause())}start(e,t,n){this.deck=[...e],this.level=t,this.renderer.setArenaTheme?.(this.arenaTheme),this.seed=n??Math.floor(Math.random()*2**31);let r=new C(this.seed^1540483477).pick(h);this.aiDeckName=r.name,this.aiDeckCards=[...r.cards],this.plays={},this.game=new j({seed:this.seed,decks:[this.deck,[...r.cards]]}),this.ai=new Ce(this.game,1,this.game.rng.fork(),be[t]),this.renderer.reset(),this.selected=null,this.drag=null,this.endAt=0,this.resultShown=!1,this.paused=!1,this.acc=0,this.stepsRun=0,this.handKey=``,this.hudKey=``,this.fullShown=!1,this.handSlots.fill(null),this.ovPause.hidden=!0,this.ovResult.hidden=!0,this.toastEl.hidden=!0,this.bannerEl.hidden=!0,this.countdownEl.hidden=!0,this.cards.forEach(e=>e.classList.remove(`selected`,`dragging`,`deny`,`dealt`)),Z(`share-manual-result`).hidden=!0;let i=`電腦（${Pm[t]}）`;this.nameEnemy.textContent=i,Z(`vs-name-enemy`).textContent=i,Z(`vs-sub-enemy`).textContent=`牌組：${r.name}`,Z(`vs-sub-me`).textContent=`獎盃 ${this.playerTrophies}・平均 ${(e.reduce((e,t)=>e+f[t].cost,0)/e.length).toFixed(1)} 能量`,Z(`vs-arena`).textContent=this.arenaName,km(this.crownsMe,3,0),km(this.crownsEnemy,3,0),this.shownCrowns=[0,0],this.emotePicker.hidden=!0,this.emoteMe.hidden=!0,this.emoteEnemy.hidden=!0;for(let e of this.emoteTimers)clearTimeout(e);if(this.emoteTimers=[],this.lastEnemyEmote=-99,this.root.querySelectorAll(`.crown-fly`).forEach(e=>e.remove()),!this.skipIntro&&Math.random()<.5&&this.enemyEmote(`luck`,2.2),this.root.hidden=!1,this.active=!0,this.coachStep=+!!this.coach,this.coachT=0,this.coachEl.hidden=!0,this.intro=this.skipIntro?0:4.18,this.sound.stopMusic(),this.skipIntro&&this.sound.startMusic(),this.introStep=-1,this.ovVs.hidden=this.skipIntro,this.ovVs.classList.remove(`out`),!this.skipIntro){for(let e of[this.ovVs,...Array.from(this.ovVs.children)])e.style.animation=`none`,e.offsetWidth,e.style.animation=``;this.sound.play(`vs`)}this.layout(),this.renderHand(),this.updateHud(),this.checkOrientation(),cancelAnimationFrame(this.raf),this.last=performance.now(),this.raf=requestAnimationFrame(this.frame)}stop(){this.active=!1,cancelAnimationFrame(this.raf),this.root.hidden=!0,Z(`rotate-hint`).hidden=!0,this.sound.stopMusic()}get running(){return this.active&&!this.paused&&this.game.phase!==`ended`}checkOrientation(){let e=!!this.landscape?.matches&&this.active;Z(`rotate-hint`).hidden=!e,e&&this.pause(`手機橫拿時畫面太小，轉回直向後再繼續。`)}get ended(){return this.game.phase===`ended`}get isActive(){return this.active}get currentSeed(){return this.seed}get rendererKind(){return this.renderer.kind}get effectCount(){return this.renderer.effectCount}debugPreview(){return{showZone:this.renderer.showZone,preview:this.renderer.preview}}get gpuStats(){return this.renderer.gpuStats??null}get qualityLevel(){return this.renderer.qualityLevel??`2d`}get frameTime(){return this.renderer.frameTime??0}layout(){if(!this.active)return;let e=this.wrap.clientWidth,t=this.wrap.clientHeight;e<=0||t<=0||(e!==this.sizeW||t!==this.sizeH)&&(this.sizeW=e,this.sizeH=t,this.renderer.resize(e,t))}updateIntro(e){this.intro=Math.max(0,this.intro-e);let t=4.18-this.intro;if(t<1.4||(this.ovVs.classList.add(`out`),t<Lm))return;this.ovVs.hidden=!0;let n=Math.min(3,Math.floor((t-Lm)/Rm));if(n!==this.introStep){this.introStep=n;let e=this.countdownEl;e.hidden=!1,e.classList.remove(`tick`,`go`),e.offsetWidth,e.textContent=n<3?String(3-n):`開戰！`,e.classList.add(`tick`),n===3&&e.classList.add(`go`),this.sound.play(n<3?`count`:`go`)}this.intro<=0&&(this.countdownEl.hidden=!0,this.last=performance.now(),this.sound.startMusic())}setCoachStep(e){this.coachStep=e,this.coachT=0}coachTipAt(e,t){this.coachTip.textContent!==e&&(this.coachTip.textContent=e,this.coachTip.style.animation=`none`,this.coachTip.offsetWidth,this.coachTip.style.animation=``);let n=this.coachTip.offsetHeight||48;this.coachTip.style.top=`${Math.max(8,Math.min(window.innerHeight-n-8,t-n))}px`}placeRing(e,t){this.coachRing.hidden=!1,this.coachRing.style.left=`${e}px`,this.coachRing.style.top=`${t}px`}updateCoach(e){let n=this.game,r=this.coachStep>0&&this.coachStep<5&&this.intro<=0&&!this.paused&&n.playing&&!this.resultShown;this.coachT+=r?e:0,r&&this.coachStep===3&&n.entities.find(e=>e.alive&&e.team===1&&e.kind===`troop`&&e.y>t.riverBottom)&&this.setCoachStep(4);let i=r&&this.coachStep!==3;if(this.coachEl.hidden=!i,i){if(this.coachHand.hidden=this.coachStep!==1,this.coachRing.hidden=!0,this.coachStep===1){let e=n.players[0],t=this.handSlots.findIndex(t=>!!t&&f[t].cost<=e.elixir);t<0&&(t=0);let r=this.cards[t].getBoundingClientRect(),[i,a]=this.screenOf(9,23),o=this.coachHand.style;o.setProperty(`--x0`,`${Math.round(r.left+r.width/2)}px`),o.setProperty(`--y0`,`${Math.round(r.top+r.height*.42)}px`),o.setProperty(`--x1`,`${Math.round(i)}px`),o.setProperty(`--y1`,`${Math.round(a)}px`),this.placeRing(i,a),this.coachTipAt(`按住一張卡，拖到自己這半邊放開，就能派兵`,a-46),this.coachT>30&&this.setCoachStep(2)}else if(this.coachStep===2)this.coachTipAt(`出牌會花下方紫色能量條的能量，能量會自己慢慢回滿`,this.panel.getBoundingClientRect().top-12),this.coachT>4.5&&this.setCoachStep(3);else if(this.coachStep===4){let e=n.entities.find(e=>e.alive&&e.team===1&&e.kind===`troop`&&e.y>t.riverBottom-2);if(e){let[t,n]=this.screenOf(e.x,e.y);this.placeRing(t,n),this.coachTipAt(`電腦的部隊過河了！在它前面出兵把它擋下來`,n-40)}else this.coachTipAt(`電腦的部隊過河了！在它前面出兵把它擋下來`,window.innerHeight*.4);this.coachT>4.5&&this.setCoachStep(5)}}}screenOf(e,t){let n=this.canvas.getBoundingClientRect(),[r,i]=this.renderer.toScreen(e,t);return[n.left+r,n.top+i]}screenOf3(e,n,r){let i=this.canvas.getBoundingClientRect(),a=this.renderer.project,[o,s]=a?a.call(this.renderer,e-t.width/2,r,n-t.height/2):this.renderer.toScreen(e,n);return[i.left+o,i.top+s]}matchInfo(){return{foe:this.aiDeckName,foeCards:[...this.aiDeckCards],level:this.level,deck:[...this.deck],plays:{...this.plays}}}simStep(){this.ai.update(),this.game.step(),this.stepsRun++,this.handleEvents(this.game.drainEvents())}handleEvents(e){if(e.length!==0){this.renderer.pushEvents(e,this.game);for(let t of e)switch(t.type){case`deploy`:this.sound.play(t.team===0?`deploy`:`enemyDeploy`),t.team===0&&(this.plays[t.cardId]=(this.plays[t.cardId]??0)+1),t.team===0&&this.coachStep===1&&this.setCoachStep(2);break;case`spawn`:if(t.source===`card`&&f[this.game.get(t.id)?.cardId??``]?.kind===`troop`){let e=this.game.get(t.id);e&&e.stats.mass>=18&&this.sound.play(`thud`)}break;case`attack`:this.sound.play(Bm(t.unit,t.ranged));break;case`hit`:t.isTower?this.sound.play(`towerHit`):t.amount>=250?this.sound.play(`heavyHit`):this.sound.play(`hit`);break;case`impact`:this.sound.play(t.visual===`ice`?`freeze`:t.visual===`magic`?`magic`:`boom`);break;case`death`:t.kind===`building`?this.sound.play(`crumble`):t.kind===`troop`&&!t.kamikaze&&this.sound.play(`death`);break;case`towerDown`:this.sound.play(t.isKing?`kingDown`:`tower`),t.cascade||this.flyCrowns(t.team===1?0:1,t.x,t.y),!t.isKing&&!t.cascade&&this.enemyEmote(t.team===1?Math.random()<.5?`grr`:`wow`:Math.random()<.5?`haha`:`good`,.9);break;case`kingActivate`:this.sound.play(`kingWake`);break;case`spellCast`:this.sound.play(t.cardId===`zap`?`zap`:t.cardId===`log`?`log`:t.cardId===`poison`?`poison`:t.cardId===`rage`?`rage`:t.cardId===`freeze`?`freeze`:t.cardId===`lightning`?`thunder`:`whoosh`);break;case`strike`:this.sound.play(`zap`);break;case`emerge`:this.sound.play(`dig`);break;case`elixir`:t.team===0&&this.sound.play(`elixir`);break;case`spell`:t.cardId===`fireball`||t.cardId===`rocket`?this.sound.play(t.cardId===`rocket`?`bigBoom`:`boom`):t.cardId===`arrows`?this.sound.play(`arrows`):t.cardId===`goblin_barrel`&&this.sound.play(`crumble`);break;case`blast`:this.sound.play(t.visual===`bomb`?`bigBoom`:`thud`);break;case`bombDrop`:this.sound.play(`fuse`);break;case`charge`:this.sound.play(`charge`);break;case`stun`:t.freeze&&this.sound.play(`freeze`);break;case`elixirRate`:this.sound.play(`phase`),this.sound.setMusicIntensity(t.mult>=3?2:1),this.banner(t.mult===3?`能量三倍！`:`能量加倍！`,t.mult===3?`延長賽最後 60 秒`:this.game.phase===`overtime`?``:`最後 60 秒`,`pink`);break;case`phase`:t.phase===`overtime`?(this.sound.play(`overtime`),this.sound.setMusicIntensity(1),this.banner(`延長賽！`,`先推倒任一座塔就獲勝`,`gold`)):t.phase===`tiebreak`&&(this.sound.play(`overtime`),this.banner(`決勝！`,`雙方塔同步扣血，最低的塔先倒`,`gold`));break;case`end`:this.sound.stopMusic(),t.result.winner===1?this.enemyEmote(`haha`,.6):t.result.winner===0&&this.enemyEmote(Math.random()<.5?`thanks`:`wow`,.6),this.endAt=performance.now()+(t.result.reason===`king`?2200:1700),this.setSelected(null),this.drag=null,this.renderer.preview=null,this.banner(t.result.winner===0?`勝利！`:t.result.winner===1?`落敗`:`平手`,``,t.result.winner===0?`gold`:``)}}}flyCrowns(e,t,n){let r=this.game.players[e].crowns,i=this.screenOf3(t,n,3),a=this.root.getBoundingClientRect(),o=e===0?this.crownsMe:this.crownsEnemy;for(let t=this.shownCrowns[e]+1;t<=r;t++){let n=o.children[t-1],r=document.createElement(`div`);r.className=`crown-fly ${e===0?`me`:`enemy`}`,r.innerHTML=Om(),r.style.left=`${i[0]-a.left-20}px`,r.style.top=`${i[1]-a.top-16}px`,this.root.appendChild(r);let s=n?.getBoundingClientRect(),c=s?s.left+s.width/2-i[0]:0,l=s?s.top+s.height/2-i[1]:-200,u=t,d=r.animate([{transform:`translate(0, 0) scale(0.4)`,opacity:0},{transform:`translate(0, -40px) scale(1.6)`,opacity:1,offset:.25},{transform:`translate(${c}px, ${l}px) scale(0.45)`,opacity:1}],{duration:820,delay:(t-this.shownCrowns[e]-1)*140,easing:`cubic-bezier(.45,.05,.55,.95)`,fill:`forwards`}),f=()=>{r.remove(),this.game.players[e].crowns>=u&&(km(o,3,Math.max(this.shownCrownCount(e),u)),this.sound.play(`crown`))};d.onfinish=f,d.oncancel=f}this.shownCrowns[e]=r}shownCrownCount(e){let t=e===0?this.crownsMe:this.crownsEnemy;return Array.from(t.children).filter(e=>e.classList.contains(`on`)).length}emoteIcon(e,t){let n=Im.find(t=>t.id===e)??Im[0],r=zp.emote(n.id,t);return r?`<img class="em-img" src="${r}" alt="" draggable="false" />`:`<span class="em">${n.em}</span>`}toggleEmotes(){if(this.emotePicker.childElementCount&&!this.emotePicker.querySelector(`.em-img`)&&zp.emote(`good`,0)&&(this.emotePicker.innerHTML=``),!this.emotePicker.childElementCount)for(let e of Im){let t=document.createElement(`button`);t.type=`button`,t.innerHTML=`${this.emoteIcon(e.id,0)}${e.text}`,t.addEventListener(`click`,()=>{this.emotePicker.hidden=!0,this.showEmote(this.emoteMe,e.id),this.sound.play(`tap`),Math.random()<.35&&this.enemyEmote(e.id===`haha`||e.id===`grr`?`haha`:e.id===`thanks`?`thanks`:`good`,1.2)}),this.emotePicker.appendChild(t)}this.emotePicker.hidden=!this.emotePicker.hidden}showEmote(e,t){let n=Im.find(e=>e.id===t)??Im[0];e.hidden=!0,e.offsetWidth,e.innerHTML=`${this.emoteIcon(n.id,+(e===this.emoteEnemy))}${n.text}`,e.hidden=!1,this.emoteTimers.push(window.setTimeout(()=>e.hidden=!0,2200))}enemyEmote(e,t){let n=performance.now()/1e3;n-this.lastEnemyEmote<8||(this.lastEnemyEmote=n,this.emoteTimers.push(window.setTimeout(()=>{this.active&&this.showEmote(this.emoteEnemy,e)},t*1e3)))}banner(e,t=``,n=``){let r=this.bannerEl;r.hidden=!0,r.offsetWidth,r.className=`banner ${n}`,r.innerHTML=t?`${e}<small>${t}</small>`:e,r.hidden=!1,clearTimeout(this.bannerTimer),this.bannerTimer=window.setTimeout(()=>r.hidden=!0,1800)}toast(e,t=!1){let n=this.toastEl;n.textContent=e,n.classList.toggle(`info`,t),n.hidden=!1,clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>n.hidden=!0,1300)}renderHand(){let e=this.game.players[0],t=`${e.hand.join(`,`)}|${e.queue[0]}`;t!==this.handKey&&(this.handKey=t,e.hand.forEach((e,t)=>{let n=this.cards[t],r=this.handSlots[t];Tm(n,e??void 0),n.classList.toggle(`empty`,!e),e&&e!==r&&r!==void 0&&this.stepsRun>0&&(n.classList.remove(`dealt`),n.offsetWidth,n.classList.add(`dealt`)),this.handSlots[t]=e}),Tm(this.nextCard,e.queue[0]))}updateHud(){let e=this.game,t=e.players[0];this.renderHand();let r=t.elixir;this.elixirFill.style.width=`${r/10*100}%`;let i=Math.floor(r+1e-6);for(let e=0;e<4;e++){let n=t.hand[e],i=this.cards[e];if(!n)continue;let a=f[n],o=a.cost>r+1e-6;i.classList.toggle(`unaffordable`,o);let s=i.lastElementChild;s&&(s.style.height=o?`${Math.min(1,r/a.cost)*100}%`:`0%`)}let a=r>=n.maxElixir-1e-6&&e.playing&&this.intro<=0;a!==this.fullShown&&(this.fullShown=a,this.elixirFull.hidden=!a,this.handEl.classList.toggle(`full`,a));let o=e.phase===`overtime`,s=e.playing?e.elixirMultiplier():1,c=`${i}|${Nm(e.timeLeft)}|${o}|${s}|${e.phase}`;c!==this.hudKey&&(this.hudKey=c,this.elixirNum.textContent=String(i),this.timer.textContent=Nm(e.timeLeft),this.timeLabel.textContent=o?`延長賽`:e.phase===`tiebreak`?`決勝`:`剩餘時間`,this.timeBox.classList.toggle(`overtime`,o||e.phase===`tiebreak`),this.timeBox.classList.toggle(`urgent`,e.timeLeft<=10&&e.playing),this.mult.hidden=s<=1,this.multText.textContent=`x${s}`,this.elixirBox.classList.toggle(`x2`,s>1))}setSelected(e){e!==null&&!this.game.players[0].hand[e]&&(e=null),this.selected=e,this.cards.forEach((t,n)=>t.classList.toggle(`selected`,n===e)),this.renderer.showZone=e!==null,this.renderer.selectedCard=e===null?null:this.game.players[0].hand[e]??null,e===null&&(this.renderer.preview=null)}canInteract(){return this.active&&!this.paused&&this.intro<=0&&this.game.playing}worldAt(e,n){if(n>=this.panel.getBoundingClientRect().top)return null;let r=this.canvas.getBoundingClientRect(),[i,a]=this.renderer.toWorld(e-r.left,n-r.top);return i<0||i>t.width||a<0||a>t.height?null:[i,a]}updatePreview(e,t,n){let r=this.game.players[0].hand[e],i=this.worldAt(t,n);if(!i||!r){this.renderer.preview=null;return}let[a,o]=this.game.snap(r,i[0],i[1]);this.renderer.preview={cardId:r,x:a,y:o,legal:this.game.canDeployAt(0,r,a,o)}}tryDeploy(e,t,n){let r=this.worldAt(t,n);return r?this.deployAt(e,r[0],r[1]):!1}deployAt(e,t,n){let r=this.game.players[0].hand[e];if(!r)return!1;let i=this.game.deploy(0,e,t,n);if(i.ok)return this.setSelected(null),this.renderHand(),!0;if(this.sound.play(`error`),i.reason===`elixir`){this.toast(`能量不足（需要 ${f[r].cost}）`);let t=this.cards[e];t.classList.remove(`deny`),t.offsetWidth,t.classList.add(`deny`)}else i.reason===`zone`&&this.toast(`這裡不能部署`);return!1}bindInput(){let e=this.root;e.addEventListener(`pointerdown`,e=>{let t=e.target;if(t.closest(`.overlay, .hud-pause, .vs, .hud-emote, .emote-picker`)||(this.emotePicker.hidden||(this.emotePicker.hidden=!0),!this.canInteract()||this.drag)||e.pointerType===`mouse`&&e.button!==0)return;let n=t.closest(`#hand .card`);if(n){e.preventDefault();let t=Number(n.dataset.index);if(!this.game.players[0].hand[t])return;this.drag={pointerId:e.pointerId,index:t,sx:e.clientX,sy:e.clientY,moved:!1,fromArena:!1,wasSelected:this.selected===t},this.setSelected(t),this.capture(e.pointerId)}else if(t.closest(`#arena-wrap`)){if(e.preventDefault(),this.selected===null){this.toast(`先點選下方的一張卡牌`,!0);return}this.drag={pointerId:e.pointerId,index:this.selected,sx:e.clientX,sy:e.clientY,moved:!0,fromArena:!0,wasSelected:!0},this.updatePreview(this.selected,e.clientX,e.clientY),this.capture(e.pointerId)}}),e.addEventListener(`pointermove`,e=>{let t=this.drag;t?e.pointerId===t.pointerId&&(!t.moved&&Math.hypot(e.clientX-t.sx,e.clientY-t.sy)>8&&(t.moved=!0,this.cards[t.index].classList.add(`dragging`)),t.moved&&this.updatePreview(t.index,e.clientX,e.clientY)):e.pointerType===`mouse`&&this.selected!==null&&this.canInteract()&&this.updatePreview(this.selected,e.clientX,e.clientY)});let t=(e,t)=>{let n=this.drag;n&&e.pointerId===n.pointerId&&(this.drag=null,this.release(e.pointerId),this.cards[n.index].classList.remove(`dragging`),t||!this.canInteract()?this.renderer.preview=null:n.moved?(this.worldAt(e.clientX,e.clientY)===null?n.fromArena||(this.setSelected(null),this.toast(`已取消出牌`,!0)):this.tryDeploy(n.index,e.clientX,e.clientY),(this.selected===null||e.pointerType!==`mouse`)&&(this.renderer.preview=null)):n.wasSelected?this.setSelected(null):this.sound.play(`tap`))};e.addEventListener(`pointerup`,e=>t(e,!1)),e.addEventListener(`pointercancel`,e=>t(e,!0)),e.addEventListener(`pointerleave`,e=>{e.pointerType===`mouse`&&!this.drag&&(this.renderer.preview=null)}),e.addEventListener(`gesturestart`,e=>e.preventDefault()),e.addEventListener(`contextmenu`,e=>e.preventDefault()),window.addEventListener(`keydown`,e=>{if(!this.active)return;if(e.key===`Escape`){this.selected===null?!this.paused&&this.game.phase!==`ended`&&this.pause():this.setSelected(null);return}if(!this.canInteract())return;let t=Number(e.key);t>=1&&t<=4&&this.setSelected(this.selected===t-1?null:t-1)})}capture(e){try{this.root.setPointerCapture(e)}catch{}}release(e){try{this.root.hasPointerCapture(e)&&this.root.releasePointerCapture(e)}catch{}}bindButtons(){Z(`btn-pause`).addEventListener(`click`,()=>this.pause()),Z(`btn-emote`).addEventListener(`click`,()=>this.toggleEmotes()),Z(`btn-resume`).addEventListener(`click`,()=>this.resume()),Z(`btn-restart`).addEventListener(`click`,()=>{this.sound.unlock(),this.start(this.deck,this.level)}),Z(`btn-quit`).addEventListener(`click`,()=>this.host.onQuit()),Z(`btn-again`).addEventListener(`click`,()=>{this.sound.unlock(),this.start(this.deck,this.level)}),Z(`btn-result-home`).addEventListener(`click`,()=>this.host.onQuit()),Z(`btn-result-deck`).addEventListener(`click`,()=>this.host.onDeck()),Z(`btn-share-result`).addEventListener(`click`,()=>void this.shareResult())}pause(e=``){this.active&&!this.paused&&this.game.phase!==`ended`&&(this.paused=!0,this.drag=null,this.renderer.preview=null,this.cards.forEach(e=>e.classList.remove(`dragging`)),Z(`pause-note`).textContent=e,Z(`pause-note`).hidden=!e,this.ovPause.hidden=!1,this.sound.stopMusic())}autoPause(){this.active&&(this.pause(`切換畫面時自動暫停，準備好再繼續。`),this.sound.suspend())}resume(){if(this.paused&&(this.sound.unlock(),this.paused=!1,this.ovPause.hidden=!0,this.acc=0,this.last=performance.now(),this.intro<=0&&this.game.playing)){this.sound.startMusic();let e=this.game.elixirMultiplier();this.sound.setMusicIntensity(e>=3?2:+(e>=2))}}showResult(){let e=this.game.result;if(!e||this.resultShown)return;this.resultShown=!0;let t=this.game.players[0],n=this.ovResult.querySelector(`.panel`);n.classList.toggle(`win`,e.winner===0),n.classList.toggle(`lose`,e.winner===1),Z(`result-title`).textContent=e.winner===0?`勝利！`:e.winner===1?`落敗`:`平手`,Z(`result-name-enemy`).textContent=`電腦（${Pm[this.level]}）`,Z(`result-row-me`).classList.toggle(`won`,e.winner===0),Z(`result-row-enemy`).classList.toggle(`won`,e.winner===1);let r=Z(`result-crowns-me`),i=Z(`result-crowns-enemy`);km(r,3,0),km(i,3,0);let a=Math.max(e.crowns[0],e.crowns[1]);for(let t=1;t<=a;t++)window.setTimeout(()=>{this.resultShown&&(km(r,3,Math.min(t,e.crowns[0])),km(i,3,Math.min(t,e.crowns[1])),this.sound.play(`crown`))},350+t*380);Z(`result-reason`).textContent=Fm[e.reason](e.winner),Z(`result-stats`).textContent=`對手：${Pm[this.level]}電腦（${this.aiDeckName}）\n你出牌 ${t.cardsPlayed} 張、花費 ${Math.round(t.elixirSpent)} 能量・對戰 ${Nm(e.time)}`,Z(`btn-share-result`).textContent=`分享戰績給朋友`,Z(`share-manual-result`).hidden=!0,this.ovResult.hidden=!1,this.sound.play(e.winner===0?`win`:e.winner===1?`lose`:`draw`),this.host.onResult(e)}async shareResult(){let e=this.game.result;if(!e)return;let[t,n]=e.crowns,r=Pm[this.level],i=e.winner===0?`我在《皇室戰爭克隆》以 ${t}:${n} 打贏${r}電腦！三分鐘一局，點開就能玩：`:e.winner===1?`我在《皇室戰爭克隆》以 ${t}:${n} 輸給${r}電腦了，換你來挑戰：`:`我在《皇室戰爭克隆》和${r}電腦打成平手，你能贏嗎？`,a=Z(`btn-share-result`),o=await Mm(i);if(o===`copied`)a.textContent=`已複製遊戲連結！`;else if(o===`manual`){let e=Z(`share-manual-result`),t=Z(`share-input-result`);t.value=Am(),e.hidden=!1,t.focus(),t.select()}}};function Bm(e,t){switch(e){case`princess`:case`archer`:return`bow`;case`musketeer`:return`gun`;case`king`:case`cannon`:return`cannon`;case`wizard`:case`baby_dragon`:return`fire`;case`witch`:return`magic`;case`spear_goblin`:case`bomber`:return`throw`;case`inferno`:return`beam`;case`giant`:case`golem`:case`golemite`:case`giant_skeleton`:return`punch`;case`bat`:case`gargoyle`:return`bite`;default:return t?`throw`:`slash`}}var Vm=[{min:0,name:`綠野競技場`,theme:0},{min:300,name:`石橋要塞`,theme:1},{min:700,name:`楓紅山谷`,theme:2},{min:1200,name:`月光湖畔`,theme:3},{min:1800,name:`雷霆高地`,theme:4},{min:2600,name:`黃金王座`,theme:5}];function Hm(e){let t=0;for(;t+1<Vm.length&&e>=Vm[t+1].min;)t++;return t}function Um(e){return Vm[Hm(e)]}function Wm(e){let t=Hm(e),n=Vm[t+1]??null;if(!n)return{next:null,need:0,frac:1};let r=Vm[t].min;return{next:n,need:n.min-e,frac:(e-r)/(n.min-r)}}var Gm={easy:20,normal:30,hard:40},Km={easy:5,normal:12,hard:18};function qm(e,t,n,r){return t===null?0:t===0?Gm[e]+(n>=3?5:0):-Math.min(r,Km[e])}function Jm(e,t){try{let n=window.localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}}function Ym(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch{}}var Xm=`bridge-tower-duel.v1`,Zm=[m,[`wolf_rider`,`ice_spirit`,`skeletons`,`musketeer`,`cannon`,`log`,`fireball`,`knight`],[`baby_dragon`,`lancer`,`bats`,`wizard`,`bomber`,`arrows`,`rage`,`tombstone`]],Qm=Zm.length;function $m(){let e=Jm(Xm,{}),t=Zm.map((t,n)=>{let r=Array.isArray(e.decks)?e.decks[n]:void 0;return Array.isArray(r)&&g(r)?[...r]:[...t]});!Array.isArray(e.decks)&&Array.isArray(e.deck)&&g(e.deck)&&(t[0]=[...e.deck]);let n=Number.isInteger(e.slot)&&e.slot>=0&&e.slot<Qm?e.slot:0,r=e.level===`easy`||e.level===`normal`||e.level===`hard`?e.level:`easy`,i=e.record,a=Math.max(0,Math.floor(Number(e.trophies)||0)),o={};if(e.cardPlays&&typeof e.cardPlays==`object`)for(let[t,n]of Object.entries(e.cardPlays))t in f&&Number(n)>0&&(o[t]=Math.floor(Number(n)));return{deck:t[n],decks:t,slot:n,muted:e.muted===!0,level:r,howtoSeen:e.howtoSeen===!0,coachDone:e.coachDone===!0,record:{win:Number(i?.win)||0,lose:Number(i?.lose)||0,draw:Number(i?.draw)||0},trophies:a,bestTrophies:Math.max(a,Math.floor(Number(e.bestTrophies)||0)),threeCrowns:Math.max(0,Math.floor(Number(e.threeCrowns)||0)),cardPlays:o,log:Array.isArray(e.log)?e.log.filter(th).slice(0,20):[]}}var eh=e=>Array.isArray(e)&&e.length===8&&e.every(e=>typeof e==`string`&&e in f);function th(e){if(!e||typeof e!=`object`)return!1;let t=e,n=t.c;return typeof t.at==`number`&&(t.w===0||t.w===1||t.w===null)&&Array.isArray(n)&&n.length===2&&n.every(e=>typeof e==`number`)&&(t.lvl===`easy`||t.lvl===`normal`||t.lvl===`hard`)&&typeof t.foe==`string`&&eh(t.foeCards)&&eh(t.deck)&&typeof t.d==`number`&&typeof t.t==`number`}function nh(e,t){e.slot=Math.max(0,Math.min(Qm-1,t)),e.deck=e.decks[e.slot]}function rh(e){Ym(Xm,e)}var ih={easy:`簡單`,normal:`普通`,hard:`困難`};function ah(e,t,n,r,i=Date.now()){e.bestTrophies=Math.max(e.bestTrophies,e.trophies),t.winner===0&&t.crowns[0]>=3&&e.threeCrowns++;for(let[t,r]of Object.entries(n.plays))e.cardPlays[t]=(e.cardPlays[t]??0)+r;e.log.unshift({at:i,w:t.winner,c:[t.crowns[0],t.crowns[1]],lvl:n.level,foe:n.foe,foeCards:[...n.foeCards],deck:[...n.deck],d:r,t:e.trophies}),e.log.length>20&&(e.log.length=20)}function oh(e){let t=null;for(let[n,r]of Object.entries(e.cardPlays))(!t||r>t.n||r===t.n&&n<t.id)&&(t={id:n,n:r});return t}function sh(e,t=Date.now()){let n=Math.floor((t-e)/6e4);if(n<1)return`剛剛`;if(n<60)return`${n} 分鐘前`;let r=Math.floor(n/60);return r<24?`${r} 小時前`:`${Math.floor(r/24)} 天前`}function ch(e){let{win:t,lose:n,draw:r}=e.record,i=t+n+r,a=oh(e);return[[`最高獎盃`,String(e.bestTrophies)],[`目前競技場`,Um(e.trophies).name],[`勝場`,String(t)],[`三皇冠勝利`,String(e.threeCrowns)],[`敗場・平手`,`${n} 敗・${r} 平`],[`勝率`,i?`${Math.round(t/i*100)}%（${i} 場）`:`—`],[`最常出的卡`,a?`${f[a.id].name}（${a.n} 次）`:`—`]]}var lh={win:{cls:`win`,text:`勝利`},lose:{cls:`lose`,text:`落敗`},draw:{cls:`draw`,text:`平手`}};function uh(e,t){let n=document.createElement(`div`);n.className=`mini-deck log-deck`,n.setAttribute(`aria-label`,t);for(let t of e){let e=document.createElement(`div`);e.className=`card`,Tm(e,t),n.appendChild(e)}return n}function dh(e,t,n=10,r=Date.now()){if(e.innerHTML=``,!t.length){let t=document.createElement(`li`);t.className=`log-empty`,t.textContent=`還沒有對戰紀錄，打一場就會出現在這裡。`,e.appendChild(t);return}let i=Om();for(let a of t.slice(0,n)){let t=lh[a.w===0?`win`:a.w===1?`lose`:`draw`],n=document.createElement(`li`);n.className=`log-item ${t.cls}`;let o=document.createElement(`div`);o.className=`log-top`;let s=a.d>0?`+${a.d}`:a.d<0?String(a.d):`±0`;o.innerHTML=`<b class="log-res">${t.text}</b><span class="log-crowns" aria-label="皇冠 ${a.c[0]} 比 ${a.c[1]}"><i class="me">${i}</i>${a.c[0]} : ${a.c[1]}<i class="foe">${i}</i></span><span class="log-delta ${a.d<0?`down`:``}">${s}</span>`;let c=document.createElement(`small`);c.className=`log-meta`,c.textContent=`對手：${ih[a.lvl]}電腦（${a.foe}）・${sh(a.at,r)}`,n.append(o,uh(a.deck,`你的牌組`),uh(a.foeCards,`電腦的牌組`),c),e.appendChild(n)}}var Q=e=>document.getElementById(e),$=$m(),fh=new we;fh.muted=$.muted;var ph=new URLSearchParams(location.search),mh=ph.get(`test`)===`1`,hh=ph.has(`seed`)?Number(ph.get(`seed`)):void 0,gh=Q(`screen-home`),_h=Q(`screen-deck`),vh=Q(`ov-howto`),yh=Q(`ov-card`),bh=`home`,xh=[],Sh=0,Ch=[],wh=null,Th=null,Eh=null,Dh=null,Oh=new zm(fh,{onResult(e){$.coachDone=!0,Oh.coach=!1,e.winner===0?$.record.win++:e.winner===1?$.record.lose++:$.record.draw++;let t=$.trophies,n=qm($.level,e.winner,e.crowns[0],t);$.trophies=Math.max(0,t+n),ah($,e,Oh.matchInfo(),$.trophies-t),rh($),Fh(n,t,$.trophies),Hm($.trophies)>Hm(t)&&(Dh=Hm($.trophies),zp.requestArt([Vm[Dh].theme])),Ph()},onQuit(){Mh(),Oh.stop(),Ih()},onDeck(){Mh(),Oh.stop(),$h(`home`)}}),kh=!1,Ah=!1;function jh(){if(!kh)try{history.pushState({btd:`battle`},``),kh=!0}catch{}}function Mh(){kh&&(kh=!1,Ah=!0,history.back())}window.addEventListener(`popstate`,()=>{Ah?Ah=!1:(kh=!1,Oh.isActive&&(Oh.running?(Oh.pause(`按了返回：先暫停對戰。再按一次返回會回到主畫面。`),jh()):(Oh.stop(),Ih())))});var Nh=Q(`home-trophies`).previousElementSibling?.outerHTML??``;function Ph(){let e=Um($.trophies);Oh.arenaTheme=e.theme,Oh.arenaName=e.name,Oh.playerTrophies=$.trophies}function Fh(e,t,n){let r=Q(`result-trophies`),i=Hm(n)>Hm(t);r.innerHTML=`${Nh}${e>0?`+${e}`:e<0?`${e}`:`±0`}<small>獎盃 ${n}${i?`・解鎖新競技場「${Um(n).name}」！`:``}</small>`,r.classList.toggle(`down`,e<0),r.hidden=!1,r.style.animation=`none`,r.offsetWidth,r.style.animation=``}function Ih(){if(_h.hidden=!0,gh.hidden=!1,Lh(),Dh!==null){let e=Dh;Dh=null,Wh(e)}}function Lh(){let e=Q(`home-deck-cards`);e.innerHTML=``;for(let t of $.deck){let n=document.createElement(`div`);n.className=`card`,Tm(n,t),e.appendChild(n)}Q(`home-avg`).textContent=`平均 ${Dm($.deck).toFixed(1)} 能量`,Qh(Q(`home-deck-tabs`),$.slot,e=>{nh($,e),rh($),fh.play(`tap`),Lh()});let{win:t,lose:n,draw:r}=$.record;Q(`home-record`).textContent=t+n+r>0?`本機戰績 ${t} 勝 ${n} 敗${r?` ${r} 平`:``}`:`還沒有戰績`,Q(`home-trophies`).textContent=String($.trophies);let i=Um($.trophies),a=Wm($.trophies);Q(`home-arena`).textContent=i.name,Q(`home-arena-fill`).style.width=`${Math.round(a.frac*100)}%`,Q(`home-arena-next`).textContent=a.next?`再 ${a.need} 座獎盃解鎖「${a.next.name}」`:`已到達最高競技場`,document.querySelectorAll(`.seg-btn`).forEach(e=>e.setAttribute(`aria-checked`,String(e.dataset.diff===$.level))),Jh();let o=zp.arenaArt(i.theme);o===void 0&&zp.requestArt([i.theme]);let s=Q(`hero-img`);o&&(s.src!==o&&(s.src=o),s.hidden=!1,Q(`hero-fallback`).hidden=!0)}var Rh=`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 8V6a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm2 0h4V6a2 2 0 1 0-4 0z" /></svg>`,zh=Q(`ov-road`),Bh=Q(`ov-unlock`);function Vh(e){let t=gp[Cp(e)];return`radial-gradient(ellipse 46% 40% at 50% 54%, ${t.grassA} 0 70%, ${t.outside} 72%, transparent 100%)`}function Hh(){let e=Q(`road-list`);e.innerHTML=``;let t=$.trophies,n=Hm(t),r=Wm(t);zp.requestArt(Vm.map(e=>e.theme));for(let i=Vm.length-1;i>=0;i--){let a=Vm[i],o=document.createElement(`li`);o.className=`road-item ${i===n?`current`:i<n?`done`:`locked`}`,o.dataset.arena=String(i);let s=document.createElement(`div`);s.className=`road-art`,s.style.background=Vh(a.theme);let c=document.createElement(`img`);c.alt=``,c.dataset.theme=String(a.theme),c.hidden=!0,s.appendChild(c),i>n&&s.insertAdjacentHTML(`beforeend`,`<span class="road-lock">${Rh}</span>`);let l=document.createElement(`div`);l.className=`road-info`;let u=i===n?r.next?`目前所在<br>再 ${r.need} 座獎盃升級`:`目前所在<br>已是最高競技場`:i<n?`已解鎖`:`還差 ${a.min-t} 座獎盃`;l.innerHTML=`<b>${a.name}</b><span class="road-min">${Nh}${a.min}</span><small>${u}</small>`,o.append(s,l),e.appendChild(o)}Uh(),Q(`road-count`).textContent=String(t),zh.hidden=!1,e.querySelector(`.road-item.current`)?.scrollIntoView({block:`center`}),fh.play(`tap`)}function Uh(){zh.querySelectorAll(`img[data-theme]`).forEach(e=>{let t=zp.arenaArt(Number(e.dataset.theme));t&&(e.src!==t&&(e.src=t),e.hidden=!1)})}function Wh(e){let t=Vm[e];Q(`unlock-name`).textContent=t.name,Q(`unlock-note`).textContent=`獎盃達到 ${t.min}，接下來的對戰都在這裡進行。`;let n=Q(`unlock-img`);n.dataset.theme=String(t.theme),n.removeAttribute(`src`),n.hidden=!0,Q(`ov-unlock`).querySelector(`.unlock-art`).style.background=Vh(t.theme),zp.requestArt([t.theme]),Gh(),Bh.hidden=!1,fh.play(`unlockArena`)}function Gh(){let e=Q(`unlock-img`),t=zp.arenaArt(Number(e.dataset.theme));t&&(e.src!==t&&(e.src=t),e.hidden=!1,e.parentElement.style.background=``)}var Kh=Q(`ov-profile`);function qh(){Q(`profile-trophies`).textContent=String($.trophies),Q(`profile-arena`).textContent=Um($.trophies).name,Q(`profile-stats`).innerHTML=ch($).map(([e,t])=>`<div><dt>${e}</dt><dd>${t}</dd></div>`).join(``),dh(Q(`profile-log`),$.log),Kh.hidden=!1,Kh.querySelector(`.profile-scroll`).scrollTop=0,fh.play(`tap`)}Q(`btn-profile`).addEventListener(`click`,qh),Q(`btn-profile-close`).addEventListener(`click`,()=>{Kh.hidden=!0}),Kh.addEventListener(`click`,e=>{e.target===Kh&&(Kh.hidden=!0)}),Q(`btn-road`).addEventListener(`click`,Hh),Q(`btn-road-close`).addEventListener(`click`,()=>{zh.hidden=!0}),zh.addEventListener(`click`,e=>{e.target===zh&&(zh.hidden=!0)}),Q(`btn-unlock-ok`).addEventListener(`click`,()=>{Bh.hidden=!0,fh.play(`tap`)});function Jh(){let e=$.muted?`音效：關`:`音效：開`;for(let t of[`btn-mute-home`,`btn-mute-pause`]){let n=Q(t);n.textContent=e,n.setAttribute(`aria-pressed`,String($.muted))}}function Yh(){$.muted=!$.muted,fh.muted=$.muted,$.muted||(fh.unlock(),fh.play(`tap`)),rh($),Jh()}function Xh(){fh.unlock(),gh.hidden=!0,_h.hidden=!0,Ph(),Oh.coach=!$.coachDone,Oh.start($.deck,$.level,hh),jh()}function Zh(e){wh=e,vh.hidden=!1,Q(`btn-howto-ok`).textContent=e?`知道了，開始！`:`知道了`}Q(`btn-play`).addEventListener(`click`,()=>{fh.unlock(),$.howtoSeen?Xh():Zh(Xh)}),Q(`btn-howto`).addEventListener(`click`,()=>Zh(null)),Q(`btn-howto-ok`).addEventListener(`click`,()=>{vh.hidden=!0,$.howtoSeen=!0,rh($);let e=wh;wh=null,e&&e()}),Q(`btn-deck`).addEventListener(`click`,()=>$h(`home`)),Q(`btn-mute-home`).addEventListener(`click`,Yh),Q(`btn-mute-pause`).addEventListener(`click`,Yh),document.querySelectorAll(`.seg-btn`).forEach(e=>e.addEventListener(`click`,()=>{$.level=e.dataset.diff??`normal`,rh($),fh.unlock(),fh.play(`tap`),Lh()})),Q(`btn-share-home`).addEventListener(`click`,async()=>{let e=Q(`btn-share-home`),t=await Mm(`來玩《皇室戰爭克隆》（非官方）：出牌派兵、過橋推塔，三分鐘一局，手機點開就能玩！`);if(t===`copied`)e.textContent=`已複製遊戲連結！`,setTimeout(()=>e.textContent=`分享遊戲連結給朋友`,2200);else if(t===`manual`){let e=Q(`share-input-home`);e.value=Am(),Q(`share-manual-home`).hidden=!1,e.focus(),e.select()}});function Qh(e,t,n){if(e.childElementCount!==Qm){e.innerHTML=``;for(let t=0;t<Qm;t++){let r=document.createElement(`button`);r.type=`button`,r.className=`slot-tab`,r.setAttribute(`role`,`tab`),r.dataset.slot=String(t),r.innerHTML=e.classList.contains(`mini`)?`<span>${t+1}</span>`:`<span>牌組 ${t+1}</span>`,r.setAttribute(`aria-label`,`牌組 ${t+1}`),r.addEventListener(`click`,()=>n(Number(r.dataset.slot))),e.appendChild(r)}}e.querySelectorAll(`.slot-tab`).forEach((e,n)=>{e.setAttribute(`aria-selected`,String(n===t)),e.classList.toggle(`active`,n===t)})}function $h(e){bh=e,xh=$.decks.map(e=>[...e]),Sh=$.slot,Ch=xh[Sh],Th=null,gh.hidden=!0,_h.hidden=!1,tg()}function eg(e){if(e!==Sh){if(Ch.length!==8){let e=Q(`deck-hint`);e.textContent=`先把這副牌補滿 8 張，才能換到其他牌組。`,e.classList.add(`warn`),fh.play(`error`)}else Sh=e,Ch=xh[e],Th=null,fh.play(`tap`),tg()}}function tg(){Qh(Q(`deck-tabs`),Sh,eg);let e=Q(`deck-slots`);e.innerHTML=``;for(let t=0;t<8;t++){let n=Ch[t];if(!n){let t=document.createElement(`div`);t.className=`slot-empty`,e.appendChild(t);continue}let r=document.createElement(`button`);r.type=`button`,r.className=`card`,Tm(r,n),r.addEventListener(`click`,()=>ng(n)),e.appendChild(r)}e.classList.toggle(`swap`,Th!==null);let t=Q(`deck-grid`);if(!t.childElementCount){let e=[...p].sort((e,t)=>f[e].cost-f[t].cost||e.localeCompare(t));for(let n of e){let e=document.createElement(`button`);e.type=`button`,e.className=`tile`,e.dataset.card=n;let r=document.createElement(`span`);r.className=`card`,Tm(r,n);let i=document.createElement(`span`);i.className=`tile-lvl`,i.textContent=`${wm(f[n].rarity)}・11 級`,e.append(r,i),e.addEventListener(`click`,()=>rg(n)),t.appendChild(e)}Q(`collection-note`).textContent=`${p.length} 張・全部 11 級`}t.querySelectorAll(`.tile`).forEach(e=>{let t=Ch.includes(e.dataset.card);e.classList.toggle(`in`,t),e.setAttribute(`aria-pressed`,String(t))});let n=Ch.length,r=Q(`deck-count`);r.textContent=`${n}/8`,r.classList.toggle(`bad`,n!==8),Q(`deck-avg-num`).textContent=n?Dm(Ch).toFixed(1):`0`,Q(`deck-avg`).textContent=`平均能量`;let i=Q(`btn-deck-done`);i.disabled=n!==8;let a=Q(`deck-hint`),o=n===8&&!Ch.some(e=>v(f[e]));a.classList.toggle(`warn`,o||Th!==null),a.textContent=Th===null?n<8?`再選 ${8-n} 張卡牌。點卡牌看數值，再按「使用」。`:o?`提醒：這副牌沒有能打飛行單位的卡，容易被蝙蝠和幼龍突破。`:`點卡牌看詳細數值，再選「使用」或「移出」。`:`點上方牌組中的一張卡，換成「${f[Th].name}」。`}function ng(e){if(Th){let t=Ch.indexOf(e);t>=0&&(Ch[t]=Th),Th=null,fh.play(`tap`),tg()}else rg(e)}function rg(e){Eh=e,Th=null;let t=f[e];Tm(Q(`info-card`),e),Q(`info-name`).textContent=t.name,Q(`info-meta`).textContent=`${wm(t.rarity)}・${t.cost} 能量・${Sm(t).join(`・`)}`,Q(`info-role`).textContent=t.role;let n=Q(`info-stats`);n.innerHTML=ag(t).map(([e,t])=>`<div><dt>${e}</dt><dd>${t}</dd></div>`).join(``);let r=Ch.includes(e),i=Q(`btn-info-use`);i.textContent=r?`移出牌組`:`使用`,i.classList.toggle(`primary`,!r),yh.hidden=!1,fh.play(`tap`)}var ig=e=>e>=2?`極快`:e>=1.5?`快`:e>=1?`中等`:`慢`;function ag(e){if(e.kind===`spell`){let t=e.spell,n=[];if(t.spawn&&n.push([`召喚`,`${d[t.spawn.unit].name} ×${t.spawn.count}`]),t.damage>0){let e=t.waves??1;n.push([t.kind===`area`?`每秒傷害`:`傷害`,e>1?`${t.damage} ×${e}`:String(t.damage)]),n.push([`對塔傷害`,String(Math.round(t.damage*t.towerPct)*e*(t.kind===`area`?t.duration:1))])}return n.push([`範圍`,t.kind===`roll`?`寬 ${(t.radius*2).toFixed(1)}・長 ${t.rollRange} 格`:`半徑 ${t.radius} 格`]),t.stun&&n.push([t.freeze?`冰凍`:`暈眩`,`${t.stun} 秒`]),t.bolts&&n.push([`劈擊`,`範圍內血量最高的 ${t.bolts} 個目標，每個 1 道`]),t.rage&&n.push([`加速`,`移動與攻擊 +${Math.round((t.rage.mul-1)*100)}%，離開後再 ${t.rage.linger} 秒`]),t.duration&&n.push([`持續`,`${t.duration} 秒`]),t.slow&&n.push([`緩速`,`${Math.round(t.slow*100)}%`]),t.pushback&&n.push([`擊退`,`${t.pushback} 格`]),n.push([`目標`,t.rage?`己方部隊與建築`:t.hitsAir?`空中與地面`:`只打地面`]),n}let t=d[e.unit].stats,n=[[`生命值`,String(t.hp)]];return t.ramp?n.push([`傷害`,t.ramp.damages.join(` → `)]):t.damage>0&&n.push([t.splash||t.projectile?.splash?`範圍傷害`:`傷害`,String(t.damage)]),t.damage>0&&!t.kamikaze&&n.push([`攻擊間隔`,`${t.hitSpeed} 秒`]),t.damage>0&&n.push([`射程`,t.range>=2?`${t.range} 格`:`近戰（${t.range}）`]),t.speed>0&&n.push([`移動速度`,ig(t.speed)]),(t.damage>0||t.ramp)&&n.push([`目標`,t.targets===`buildings`?`只打建築`:t.targets===`ground`?`地面`:`空中與地面`]),n.push([`部署時間`,`${t.deployTime} 秒`]),(e.count??1)>1&&n.push([`數量`,`×${e.count}`]),t.lifetime&&n.push([`存在時間`,`${t.lifetime} 秒`]),t.charge&&n.push([`衝鋒傷害`,String(t.charge.damage)]),t.deathDamage&&n.push([`死亡傷害`,String(t.deathDamage.damage)]),t.spawner&&n.push([`召喚`,`${d[t.spawner.unit].name} ×${t.spawner.count}／${t.spawner.pause} 秒`]),t.deathSpawn&&n.push([`死亡時`,`${d[t.deathSpawn.unit].name} ×${t.deathSpawn.count}`]),t.projectile?.freeze&&n.push([`冰凍`,`${t.projectile.freeze} 秒`]),t.jumpsRiver&&n.push([`特性`,`可跳過河`]),t.kamikaze&&!t.projectile&&n.push([`特性`,`撞到建築就解體`]),t.towerMul!==void 0&&n.push([`對塔傷害`,String(Math.round(t.damage*t.towerMul))]),t.tunnelSpeed&&n.push([`特性`,`可部署到場上任何地方（從地底鑽過去）`]),t.elixirGen&&n.push([`產生能量`,`每 ${t.elixirGen.interval} 秒 +${t.elixirGen.amount}，倒下時 +${t.elixirGen.onDeath}`]),n}Q(`btn-info-close`).addEventListener(`click`,()=>{yh.hidden=!0}),yh.addEventListener(`click`,e=>{e.target===yh&&(yh.hidden=!0)}),Q(`btn-info-use`).addEventListener(`click`,()=>{let e=Eh;if(yh.hidden=!0,!e)return;let t=Ch.indexOf(e);t>=0?Ch.splice(t,1):Ch.length<8?Ch.push(e):Th=e,fh.play(`tap`),tg()}),Q(`btn-deck-done`).addEventListener(`click`,()=>{xh.every(e=>g(e))&&($.decks=xh.map(e=>[...e]),nh($,Sh),rh($),Th=null,bh===`battle-result`?Xh():Ih())}),Q(`btn-deck-reset`).addEventListener(`click`,()=>{xh[Sh]=[...Zm[Sh]],Ch=xh[Sh],Th=null,tg()});function og(){let e=window.visualViewport?.height??window.innerHeight;document.documentElement.style.setProperty(`--app-h`,`${Math.round(e)}px`)}og(),window.addEventListener(`resize`,og),window.visualViewport?.addEventListener(`resize`,og),window.addEventListener(`orientationchange`,()=>setTimeout(og,300)),mh&&(window.__btd={battle:Oh,settings:$,sound:fh,portraits:zp,game:()=>Oh.game,autoplay(e){let t=Oh.game,n=new Ce(t,0,t.rng.fork(),be.normal),r=Math.round(e*30);for(let e=0;e<r&&t.phase!==`ended`;e++)n.update(),Oh.simStep()},showUnlock(e){Wh(e)},skipIntro(e=!0){Oh.skipIntro=e},fastForward(e){let t=Math.round(e*30);for(let e=0;e<t&&Oh.game.phase!==`ended`;e++)Oh.simStep()}}),window.__booted=!0;var sg=document.getElementById(`boot-fill`);sg&&(sg.style.width=`100%`),document.getElementById(`boot`)?.remove(),Ih(),zp.onUpdate(()=>{Em(),gh.hidden||Lh(),zh.hidden||Uh(),Kh.hidden||Em(Kh),Bh.hidden||Gh()}),zp.start($.deck);