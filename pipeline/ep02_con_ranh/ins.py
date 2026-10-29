import re
L=[l.rstrip('\n') for l in open('script.txt') if l.strip()]
INS={
'modem2':"""sangmo|N|Sáng ra, Lợi kể lại cho má nghe. Bà Tư không nói một lời, chỉ lặng lẽ cầm cái cuốc ra gò mả.
sangmo|N|Bà lấp cái lỗ nhỏ lại, đặt lên trên một chén cơm trắng, một quả trứng luộc, rồi cắm ba cây nhang.
sangmo|L|Má... đêm qua con thấy rõ ràng mà. Có thằng nhỏ ngồi bới mả. Nó quay lại cười với con!
sangmo|BT|Con thấy lộn rồi. Chó hoang nó bới đó. Từ nay tối đừng có ra sau vườn nữa nghe hông!
sangmo|N|Nhưng Lợi để ý, chén cơm má đặt lên mộ, không phải đặt ở mộ thằng Bé. Mà đặt ở nấm mộ cũ nhất, nấm mộ đầu tiên.""",
'namco':"""matlai|N|Một đêm cuối tháng tư, Hiền giật mình thức giấc lúc nửa khuya. Cái võng giữa nhà trống không.
matlai|H|Lại ơi! Con đâu rồi! Anh Lợi, dậy đi anh! Con mình đâu mất rồi!
matlai|N|Hai vợ chồng cầm đèn dầu lục khắp nhà. Cuối cùng, họ thấy thằng Lại nằm sấp dưới đất, ngay cửa sau.
matlai|N|Đầu nó quay về phía gò mả. Và trên lưng nó, có năm dấu tay con nít, in bằng bùn non, còn ướt nhẹp.
matlai|L|Trời ơi... nó mới có bốn tháng, nó đâu có biết bò! Ai đem nó ra đây vậy?
matlai|H|Có người bế nó ra đây anh ơi... một bàn tay nhỏ... nhỏ cỡ tay thằng Bé...
matlai|N|Bà Tư đứng trong bóng tối, nhìn năm dấu tay trên lưng cháu. Môi bà mấp máy, đếm thầm. Một, hai, ba, bốn, năm.""",
'chet3':"""rach|N|Lúc đó, ngoài sông, Lợi đang gồng mình chèo xuồng trong mưa. Nước lớn, sóng đánh chòng chành.
rach|N|Tới khúc ngã ba, anh thấy mũi xuồng bỗng nặng trĩu, như có ai mới bước xuống ngồi.
rach|N|Lợi đưa đèn lên. Ở đầu mũi xuồng, có một đứa con nít ngồi quay lưng lại, người ướt sũng, vai có dấu xanh.
rach|L|Bé... Bé hả con? Con... con muốn gì? Con tha cho em con đi con!
rach|GBE|Ba về đi... Em con đi rồi.
rach|N|Lợi chớp mắt một cái, mũi xuồng trống trơn. Anh quay xuồng chèo về như điên, nhưng đã trễ.""",
'baba':"""momuoi|N|Hôm đó, trước khi qua nhà bà Ba Thơm, Hiền ghé thăm mộ má ruột ở cuối đồng.
momuoi|N|Nấm mộ đất nằm giữa ruộng lúa, cỏ mọc um tùm. Hiền nhổ cỏ, đốt nhang, rồi ngồi thụp xuống khóc.
momuoi|H|Má ơi... má nói nhà đó thiếu má một món nợ. Là nợ gì vậy má? Má chỉ cho con đi má...
momuoi|N|Gió đồng thổi qua. Mấy cây nhang cháy nghiêng, khói bay thẳng về một hướng. Hướng nhà bà mụ Ba Thơm.""",
'doi2':"""goi|N|Đêm đó, Lợi nằm trên võng, người nóng như lửa. Hiền ngồi kế bên, quạt cho chồng.
goi|N|Gần nửa đêm, Lợi bỗng mở mắt, ngồi bật dậy, nhìn ra hướng bến sông.
goi|GH|Anh Lợi ơi... xuống đây với em nè anh... nước mát lắm...
goi|L|Hiền... em kêu anh hả? Em ra bến chi giờ này vậy?
goi|H|Anh Lợi! Em ở đây nè! Em ngồi kế bên anh nè! Anh đừng đi!
goi2|N|Nhưng Lợi như người mộng du, gạt tay vợ ra, đi thẳng xuống bến. Nước rạch đen ngòm, lặng như tờ.
goi2|N|Hiền chạy theo, thấy chồng đã lội xuống nước tới ngực. Phía trước anh, một cái bóng nhỏ đang đứng trên mặt nước, vẫy tay.
goi2|H|Anh Lợi! Quay lại! Đó hổng phải em! Đó là nó đó anh!
goi2|N|Hiền nhảy xuống, níu được tóc chồng, lôi vô bờ. Lợi ho sặc sụa, nước rạch trào ra từ miệng.
goi2|L|Anh nghe giọng em... rõ ràng là giọng em mà... sao lại là nó...
goi2|N|Trên mặt nước, cái bóng nhỏ đã biến mất. Chỉ còn tiếng cười khúc khích, vọng lại từ phía ngã ba sông.""",
}
out=[]
for i,l in enumerate(L):
    out.append(l);k=l.split('|')[0]
    nk=L[i+1].split('|')[0] if i+1<len(L) else None
    if k in INS and nk!=k: out+=INS.pop(k).split('\n')
assert not INS,INS
open('script.txt','w').write('\n'.join(out)+'\n')
