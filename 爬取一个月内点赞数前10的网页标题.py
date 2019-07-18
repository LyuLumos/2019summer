# -*- coding=utf-8 -*-
# 爬取一个月内点赞数前10的网页标题
# 引入需要使用到的库 
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless') # 无头模式
driver = webdriver.Chrome(chrome_options=chrome_options)
driver.get("https://piyao.sina.cn/")

for i in range(2,270):  # 30天对应的范围
    js = "var q=document.documentElement.scrollTop={}".format(i*100)
    driver.execute_script(js)
    time.sleep(0.1) # 防止滚动过快无法加载

times = driver.find_elements_by_class_name('day_date') # 时间
length = len(times) # 记录天数
comment_counts = driver.find_elements_by_class_name('comment_text') # 评论数

# 将上述text里的信息转存至另一列表
time_texts = []
title_texts = []
comment_counts_texts = []
for cur in range(1,length):
    titles = driver.find_elements_by_xpath('//div[@class="zy_day" and position()='+str(cur)+']/div[@class="day_date"]/following-sibling::ul//div[@class="left_title"]')
    for title in titles:
        time_texts.append(times[cur-1].text)
        title_texts.append(title.text) # 将时间和文章标题对应加入两个列表
for i in comment_counts:
    comment_counts_texts.append(int(i.text))
# 把数据组合成元组的列表
title_and_counts = zip(title_texts, comment_counts_texts, time_texts)
# 排序
high_count = sorted(title_and_counts,  key=lambda x : x[1], reverse=True)
# 输出结果
for x in high_count[:10]:
    print('评论数：', x[1], '\t', x[2], '\t', x[0])


'''
评论数： 7492    2019-07-04      捉谣记|三峡大坝变形要溃坝了？三峡集团辟谣：卫星图会有偏差
评论数： 1863    2019-07-09      捉谣记|官员儿子庆高考670分醉驾致6死？谣言
评论数： 904     2019-07-09      捉谣记|上海因垃圾分类引发命案？案件发生在广东且与垃圾分类无关
评论数： 32      2019-06-26      捉谣记|因女孩深夜被打事件“走红”的绵阳网警小编辞职了？ 警方：仍坚守岗位
评论数： 27      2019-07-03      捉谣记|北京圆明园并蒂莲被盗？虚惊一场！已长成并蒂莲蓬
评论数： 19      2019-07-09      捉谣记|中国盗窃美国知识产权6000亿？这一谣言是咋出笼的
评论数： 16      2019-07-13      捉谣记|高等学历继续教育将延长学年制？教育部辟谣
评论数： 13      2019-06-18      捉谣记|有关四川宜宾市地震的这些谣言 就不要再传了
评论数： 7       2019-07-03      捉谣记|张全蛋向李彦宏头上泼水？脸盲症患者再见！
评论数： 5       2019-07-10      捉谣记|官方公布酒驾玛莎拉蒂女车主有间歇性精神病？消息不靠谱
'''