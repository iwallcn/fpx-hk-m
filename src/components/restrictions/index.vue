<template>
  <div class="mainland">
    <!-- <x-header class="layout-header">{{ title }}</x-header> -->
    <group class="first-cell">
      <cell-box is-link
        @click.native="goCategory(item)"
        v-for="(item, index) in contrabandData"
        :key="index">{{ item.firstTitle }}</cell-box>
      <div class="nodata"
        v-if="!contrabandData.length">
        <i class="iconfont icon-nodata"></i>
        <p>暫無數據哦</p>
      </div>
    </group>
  </div>
</template>

<script>
import { Group, CellBox, XHeader } from 'vux'
import { mapMutations } from 'vuex'
export default {
  name: 'contraband',
  data () {
    return {
      title: '禁運品',
      contrabandData: [
        {
          firstTitle: '中國大陸-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '海關禁運',
              contrabandDetail: [
                '⑴ 無線電收發信機、通信保密機；',
                '⑵ 煙、酒；',
                '⑶ 瀕危的和珍貴的動物、植物（均含標本）及其種子和繁殖材料；',
                '⑷ 國家貨幣；',
                '⑸ 海關限制進境的其他物品。'
              ]
            },
            {
              categoryTitle: '限制出境物品',
              contrabandDetail: [
                '⑴ 金銀等貴重金屬及其製品；',
                '⑵ 國家貨幣；',
                '⑶ 外幣及其有價證券；',
                '⑷ 無線電收發信機、通信保密機；',
                '⑸ 貴重中藥材；',
                '⑹ 一般文物；',
                '⑺ 海關限制出境的其他物品。'
              ]
            },
            {
              categoryTitle: '禁止出境物品',
              contrabandDetail: [
                '⑴ 列入禁止進境範圍的所有物品；',
                '⑵ 內容涉及國家秘密的手稿、印刷品、膠捲、照片、唱片、影片、錄音帶、錄影帶、鐳射視盤、電腦存儲介質及其它物品；',
                '⑶ 珍貴文物及其它禁止出境的文體；',
                '⑷ 瀕危的和珍貴的動物、植物（均含標本）及其種子和繁殖材料。'
              ]
            }
          ]
        },
        {
          firstTitle: '美國-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '美國出口禁運品類',
              contrabandDetail: [
                '⑴ 燕盞、燕窩（罐頭裝燕窩除外）；',
                '⑵ 二手物品、功能性眼罩、虛擬實境頭盔（影音類）、遊戲機、可擕式遊戲機、遊戲機體感儀、遊戲手柄、鐘錶組件類其他物品；',
                '⑶ 肉製品、煙酒、人參、鮮活動植物、水產類食品、寵物食品（食糧/保健品）、狗或貓的毛皮製成的物品、汽車配件類限制入境物品；',
                '⑷ 香水、指甲油、壓縮氣體製品（高壓噴霧）、含酒精類易燃易爆品；',
                '⑸ 含腐蝕性物品、染髮劑、生化製品及容器、眼藥水等藥品和化學物品；',
                '⑹ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑺ 純電池、移動電源、音響音箱類管制物品；',
                '⑻ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
                '⑼ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑽ 彩票和當地州、聯邦法律禁止進口的賭博設備；',
                '⑾ 酒精，酒（限運，需許可證）；',
                '⑿ 各類危害國家安全和社會政治穩定以及淫穢出版物、光碟、書籍、宣傳品、印'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 婴幼儿奶粉、大米、肉制品、鲜活动植物、水产类食品、香烟、酒限制入境物品；',
                '⑵ 各药品、类烈性毒药、麻醉药物、精神药物、药物样品类违禁药品；',
                '⑶ 管制刀具、仿真枪、消防枪等可射击子弹的玩具枪、各类刀具等危险武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            }
          ]
        },
        {
          firstTitle: '日本-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '日本出口禁運品類',
              contrabandDetail: [
                '⑴ 桃子水、含酵素、含稀有成分（如蘆薈、珊瑚等）的化妝品；(桃子水近日成分有改, 新商品可放行)',
                '⑵ 肉製品、煙酒、人參、鮮活動植物、水產類食品、寵物食品（食糧/保健品）、汽車配件類限制入境物品；',
                '⑶ 含腐蝕性物品、染髮劑、生化製品及容器、眼藥水等藥品和化學物品；',
                '⑷ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑷ 純電池、移動電源、音響音箱、壓縮氣體製品（高壓噴霧）類管制物品；',
                '⑹ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
                '⑺ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑻ 酒精度超過24，或燃點低於60度的洗護類商品;',
                '⑼ 各類危害國家安全和社會政治穩定以及淫穢出版物、光碟、書籍、宣傳品、'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 婴幼儿奶粉、大米、肉制品、鲜活动植物、水产类食品、香烟、酒限制入境物品；',
                '⑵ 各药品、类烈性毒药、麻醉药物、精神药物、药物样品类违禁药品；',
                '⑶ 管制刀具、仿真枪、消防枪等可射击子弹的玩具枪、各类刀具等危险武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            },
            {
              categoryTitle: '海運禁止進口品類',
              contrabandDetail: [
                '(1) 鋰電池、移動電源、充電電池、帶充電板的手機殼；',
                '(2) 包裝內不含緩衝材料的工藝品、玻璃陶瓷製品、各類樂器、各類袋裝液體等易破易碎品，及巧克力、生巧類高溫易融食品支援轉運服務，但難以有效應對國際運輸，轉運過程保丟不保損，不保證產品保質期。'
              ]
            }
          ]
        },
        {
          firstTitle: '英國-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '英國出口禁運品類',
              contrabandDetail: [
                '⑴ 不接受帶電池產品、醫療器具，如：性別測試紙、血糖試紙、家用血糖計、血壓計、洗鼻器、霧化機、空氣制氧機。',
                '⑵ 含腐蝕性物品、染髮劑、生化製品及容器、眼藥水等藥品和化學物品；',
                '⑶ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑷ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
                '⑸ 成人奶粉、肉製品、水產類食品、人參、煙酒、燕盞、燕窩（罐頭裝燕窩除外）、魚油、功能飲料類食品飲料；',
                '⑹ 鮮活動植物、寵物食品（貓/狗糧）、二手物品、光碟、書籍、汽車配件、功能性眼罩、虛擬實境頭盔（影音類）、遊戲機、可擕式遊戲；',
                '⑺ 機、遊戲機體感儀、遊戲手柄、鐘錶組件類其他物品；',
                '⑻ 手機、電腦等帶電池產品。'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 嬰幼兒奶粉、大米、肉製品、鮮活動植物、水產類食品、香煙、酒限制入境物品；',
                '⑵ 各藥品、類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑶ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            }
          ]
        },
        {
          firstTitle: '德國-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '德國出口禁運品類',
              contrabandDetail: [
                '⑴ 肉製品、煙酒、人參、鮮活動植物、水產類食品、寵物食品（食糧/保健品）、汽車配件類限制入境物品；',
                '⑵香水、指甲油、壓縮氣體製品（高壓噴霧）、含酒精類易燃易爆品；',
                '⑶ 含腐蝕性物品、染髮劑、生化製品及容器、眼藥水等藥品和化學物品；',
                '⑷ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑸ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
                '⑹ 各類危害國家安全和社會政治穩定以及淫穢出版物、光碟、書籍、宣傳品、印刷品等。'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 婴幼儿奶粉、大米、肉制品、鲜活动植物、水产类食品、香烟、酒限制入境物品；',
                '⑵ 各药品、类烈性毒药、麻醉药物、精神药物、药物样品类违禁药品；',
                '⑶ 管制刀具、仿真枪、消防枪等可射击子弹的玩具枪、各类刀具等危险武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            }
          ]
        },
        {
          firstTitle: '韓國-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '韓國出口禁運品類',
              contrabandDetail: [
                '⑴ 含腐蝕性物品、染髮劑、生化製品及容器、眼藥水等藥品和化學物品；',
                '⑵ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
                '⑶ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
                '⑷ 嬰幼兒奶粉、成人奶粉、肉製品、水產類食品、人參、煙酒、燕盞、燕窩（罐頭裝燕窩除外）、魚油、功能飲料類食品飲料；',
                '⑸ 鮮活動植物、寵物食品（貓/狗糧）、二手物品、光碟、書籍、汽車配件等國家禁止入境物品；',
                '⑹ 功能性眼罩、虛擬實境頭盔（影音類）、遊戲機、可擕式遊戲機、遊戲機體感儀、遊戲手柄、鐘錶組件類其他物品。'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 婴幼儿奶粉、大米、肉制品、鲜活动植物、水产类食品、香烟、酒限制入境物品；',
                '⑵ 各药品、类烈性毒药、麻醉药物、精神药物、药物样品类违禁药品；',
                '⑶ 管制刀具、仿真枪、消防枪等可射击子弹的玩具枪、各类刀具等危险武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            }
          ]
        },
        {
          firstTitle: '加拿大-中國香港',
          contrabandCategory: [{
            categoryTitle: '加拿大出口禁運品明細',
            contrabandDetail: [
              '⑴ 槍支彈藥、管制器具、爆炸物品、壓縮和液化氣體及其容器、易燃液體、易燃固體、自燃物質、遇水易燃物質、氧化劑和過氧化物、毒性物質：如砷、砒霜等、放射性物質：如鈾、鈷、鐳、鈈等、生化製品、傳染性、感染性物質：如病菌等、腐蝕性物質：如硫酸等；',
              '⑵ 毒品及吸毒工具、非正當用途麻醉藥品和精神藥品、非正當用途的易制毒化學品：',
              '   ① 毒品、麻醉藥品和精神藥品：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、海洛因、可卡因、大麻、甲基苯丙胺（冰毒）、氯胺酮、甲卡西酮、苯丙胺、安鈉咖等；',
              '   ② 易制毒化學品：如胡椒醛、黃樟素、黃樟油、麻黃素、偽麻黃素、羥亞胺、鄰酮、苯乙酸、溴代苯丙酮、醋酸酐、甲苯、丙酮等；',
              '   ③ 吸毒工具：如冰壺等；"',
              '⑶ 出版物、印刷品、音像製品等宣傳品；',
              '⑷ 間諜專用器材：如暗藏式竊聽器材、竊照器材、突發式收發報機、一次性密碼本、密寫工具、用於獲取情報的電子監聽和截收器材等；',
              '⑸ 非法偽造物品：如偽造或者變造的貨幣、證件、公章等；',
              '⑹ 侵犯知識產權和假冒偽劣物品：',
              '   ① 侵犯知識產權：如侵犯專利權、商標權、著作權的圖書、音像製品等；',
              '   ② 假冒偽劣：如假冒偽劣的食品、藥品、兒童用品、電子產品、化妝品、紡織品等；',
              '⑺ 瀕危野生動物及其製品：如象牙、虎骨、犀牛角及其製品等；',
              '⑻ 禁止進出境物品：如有礙人畜健康的、來自疫區的以及其他能傳播疾病的食品、藥品或者其他物品；內容涉及國家秘密的檔、資料及其他物品；',
              '⑼ 其他：',
              '   ① 軍用物品，核心技術等加拿大海關出口管制物品；',
              '   ② 海參；',
              '   ③ 嚴禁郵寄任何含有大麻成分（如標註THC、Cannibis等字樣）的物品。'
            ]
          }, {
            categoryTitle: '香港禁止進口品類',
            contrabandDetail: [
              '⑴ 嬰幼兒奶粉、大米、肉製品、鮮活動植物、水產類食品、香煙、酒限制入境物品；',
              '⑵ 各藥品、類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
              '⑶ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器。'
            ]
          }, {
            categoryTitle: '航空禁運品類',
            contrabandDetail: [
              '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
              '⑵ 管制刀具：各類刀具一律不可收運；',
              '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉幹、蓖麻製品等，精油、染發劑、染發劑、精油、香薰、香水、指甲油、洗甲水、發膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
              '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
              '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
              '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、仿真槍、瞄準鏡、槍管、仿真武器模型等，玩具氣槍及其配件；',
              '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
              '⑻ 強烈刺激性氣味的物品：如榴蓮、菠蘿蜜、酸筍；',
              '⑼ 各類烈性毒藥：如坨、氰化物、砒霜；',
              '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
              '⑾ 有價證券及貴重物品：如提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
              '⑿ 其他：粉末狀物品(不論何種顏色) 、液體（不論使用何種包裝）、可口可樂碳酸飲料、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
            ]
          }]
        },
        {
          firstTitle: '澳大利亞-中國香港',
          contrabandCategory: [{
            categoryTitle: '澳大利亞出口禁運品明細',
            contrabandDetail: [
              '⑴ 含腐蝕性物品、染發劑、生化製品及容器、眼藥水等藥品和化學物品；',
              '⑵ 各類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
              '⑶ 電池、移動電源、音響類航空管制物品；',
              '⑷ 管制刀具、仿真槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器；',
              '⑸ 成人奶粉、肉製品、水產類食品、人參、煙酒、燕盞、燕窩（罐頭裝燕窩除外）、魚油、功能飲料類食品飲料；',
              '⑹ 鮮活動植物、寵物食品（貓 / 狗糧）、二手物品、光碟、書籍、交通工具及配件等國家禁止入境物品；',
              '⑺ 功能性眼罩、虛擬現實頭盔（影音類 + B10: B11）、遊戲機、可攜式遊戲機、遊戲機體感儀、遊戲手柄、鐘錶組件類其他物品。'
            ]
          }, {
            categoryTitle: '香港禁止進口品類',
            contrabandDetail: [
              '⑴ 嬰幼兒奶粉、大米、肉製品、鮮活動植物、水產類食品、香煙、酒限制入境物品；',
              '⑵ 各藥品、類烈性毒藥、麻醉藥物、精神藥物、藥物樣品類違禁藥品；',
              '⑶ 管制刀具、模擬槍、消防槍等可射擊子彈的玩具槍、各類刀具等危險武器。'
            ]
          }, {
            categoryTitle: '航空禁運品類',
            contrabandDetail: [
              '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
              '⑵ 管制刀具：各類刀具一律不可收運；',
              '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉幹、蓖麻製品等，精油、染發劑、染發劑、精油、香薰、香水、指甲油、洗甲水、發膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
              '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
              '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
              '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、仿真槍、瞄準鏡、槍管、仿真武器模型等，玩具氣槍及其配件；',
              '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
              '⑻ 強烈刺激性氣味的物品：如榴蓮、菠蘿蜜、酸筍；',
              '⑼ 各類烈性毒藥：如坨、氰化物、砒霜；',
              '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
              '⑾ 有價證券及貴重物品：如提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
              '⑿ 其他：粉末狀物品(不論何種顏色) 、液體（不論使用何種包裝）、可口可樂碳酸飲料、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
            ]
          }]
        },
        {
          firstTitle: '中國台灣-中國香港',
          contrabandCategory: [
            {
              categoryTitle: '臺灣出口禁運品類',
              contrabandDetail: [
                '⑴ 含藥性之化妝品、面膜、牙膏、肥皂及其他用於身體清潔劑；',
                '⑵ 含藥性之漱口劑、口腔芳香劑、假牙清潔劑；',
                '⑶ 保健食品、減肥藥、壯陽藥（保健品特貨可走，只限個人名進口，每種產品不能超過12瓶，合計不得超過36瓶，重量限制6KG以下，美金1000元以下）；',
                '⑷ 香煙、電子煙及其相關零配件、煙油(不管有無尼古丁成份)；',
                '⑸ 殺蟲劑、除草劑、蚊香；',
                '⑹ 水果、植物、種子、原生木頭(不管有無裁切)；',
                '⑺ 生肉、生魚、醃勳製成之肉品(包含香腸、火腿)、活體動物(牛肉幹、肉製品、水產類食品、寵物食品、左旋肉堿、所有含肉的食品（速食麵只要調料包含肉也不能走）;',
                '⑻貓狗飼料及其他寵物飼料、貓狗藥品及其他寵物藥品;',
                '⑼綠茶、紅茶、烏龍茶、鐵觀音(不管是否為熟茶)、幹草菇、幹香菇其他幹菇類、香菇、草菇其他食用菇類，生鮮或冷藏；',
                '⑽食品類：糖果、零嘴、幹炒花生、紅棗、梅子（零食特貨可走，只限個人名進口，重量限制6KG以下，美金1000元以下）；',
                '⑾相關器材用於醫療用途者、假牙黏劑、牙科用蠟、體脂計、血糖儀、有度數之眼鏡、隱形眼鏡或塑膠制隱形眼鏡用毛胚（醫療用品不能走：藥品，洗鼻器，沖牙器，紅外線耳體溫計，血壓計）；',
                '⑿ 手指虎、十字弓、警棍、甩棍、匕首、武士刀、劍、活性炭、木炭、土、粘土等'
              ]
            },
            {
              categoryTitle: '香港禁止進口品類',
              contrabandDetail: [
                '⑴ 婴幼儿奶粉、大米、肉制品、鲜活动植物、水产类食品、香烟、酒限制入境物品；',
                '⑵ 各药品、类烈性毒药、麻醉药物、精神药物、药物样品类违禁药品；',
                '⑶ 管制刀具、仿真枪、消防枪等可射击子弹的玩具枪、各类刀具等危险武器。'
              ]
            },
            {
              categoryTitle: '航空禁運品類',
              contrabandDetail: [
                '⑴ 液壓裝物品：防曬噴霧、生髮劑、氣霧劑、摩絲、光亮劑、空氣清新劑、殺蟲劑、驅蚊劑等；',
                '⑵ 管制刀具：各類國家管制刀具（匕首、三棱刀、三棱刮刀、半圓刮刀、侵刀、扒皮刀、羊骨刀、獵刀、彈簧刀、單刃及雙刃尖刀（刀體八釐米以上，帶自鎖裝置或非折疊式）、武術用刀(能開刃的)、武術用劍（能開刃的）、少數民族用的藏刀、腰刀、靴刀、弓、弩等；（備註：若無法區分為何種刀具，超過50釐米長的廚房刀具、運動競技類刀劍和刀體超過25釐米的一律不可收運）',
                '⑶ 易燃易爆物品：指甲油、香水、打火機、膠水（包括含膠水的化妝品）、雷管、炸藥、桐油、酒精、生漆、柴油、瓦斯氣瓶、磷、硫磺、火柴、香薰、剃鬚刀清洗液、煙花爆竹、起爆引信、活性炭、椰肉乾、蓖麻製品等，精油、染髮劑、染髮劑、精油、香薰、香水、指甲油、洗甲水、髮膠、髮蠟、 雙眼皮膠水及其他含膠水成分的化妝品、 高壓易燃氣體、液體（包括有泵頭的壓縮型護膚品、噴霧劑等）、包裝成分說明有乙醇、酒精的化妝品等；',
                '⑷ 氧化劑和過氧化物：高錳酸鉀、漂白劑、小型發氧器；',
                '⑸ 含磁鐵及帶有較強磁性地物體、電池類商品及其配件：充電寶、充電電池、移動電源、電子元件（如單獨寄遞的紐扣電池、單獨郵寄批量的乾電池）、音響設備、磁鋼、帶磁性的玩具，外置電池、無線電收發信機、通信保密機；',
                '⑹ 槍支及其配件：涉及“武器”和“槍支”概念的任何貨品（含玩具）：子彈、炮彈、手榴彈、地雷、炸彈、弓箭及其配件、可射擊子彈的玩具槍、模擬槍、瞄準鏡、槍管、模擬武器模型等，玩具氣槍及其配件；',
                '⑺ 危險化學品：各類腐蝕性物品，如硫磺、鹽酸、硝酸、有機溶劑、農藥、雙氧水等，各類放射性元素及容器，具有ą、β、γ射線和中子流的貨物及金屬，如鐳、鈾、鈈、錒和核能物品等，盛或放過該類物質的容器或被該類物質污染的物品，各類生化製品和傳染性物品，炭疽、危險性病菌、醫藥用廢棄物等；',
                '⑻ 強烈刺激性氣味的物品：如榴槤、菠蘿蜜、酸筍；',
                '⑼ 各類烈性毒藥：如坨、氰化物、砒霜。',
                '⑽ 各類麻醉藥物：如鴉片（包括罌粟殼、花、苞、葉）、嗎啡、可卡因、海洛因、大麻、冰毒、麻黃素及其他製品等；',
                '⑾ 有價證券及貴重物品：提貨單、核銷單、護照、匯票、發票、債券、貨幣現金、金銀首飾、人造首飾，化石類如琥珀、瑪瑙等；',
                '⑿ 其他：粉末狀物品 (不論何種顏色) 、液體（不論使用何種包裝）、活體動物、外包裝有危險標誌的貨品、沒有國家音像出版社證明的音像製品（含CD、VCD）等，包裝不妥，可能危害人身安全、污染或者損毀其他寄遞件、設備的物品等。'
              ]
            }
          ]
        }
      ]
    }
  },
  created () {

  },
  methods: {
    goCategory (item) {
      this.SET_CONTRABANDCATEGORY(item)
      this.$router.push({ path: '/restrictions/contrabandCategory' })
    },
    ...mapMutations(['SET_CONTRABANDCATEGORY'])
  },
  components: {
    Group,
    CellBox,
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  h1 {
    text-align: center;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
  }
  .layout-header {
    background: @primary !important;
  }
</style>
