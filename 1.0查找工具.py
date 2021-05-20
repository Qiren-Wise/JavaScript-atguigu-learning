import os
folder = r'E:\学习\Web 前端'
def search(folder):     # 函数一    查找.txt文件，并获取文件名
    f = os.listdir(os.curdir)
    for each_file in f:
        if os.path.splitext(each_file)[1] == '.txt':
            file_name = each_file.split('.txt',1)[0]
            content = open(each_file,encoding='utf-8')
            s = split(content)
            create_new(s,file_name)
            content.close()
     
def split(content):     # 函数二    把文件中的内容分开
    file_title = []
    for each_con in content:
        if 'P' and '. ' in each_con: 
            (nums,title) = each_con.split('. ',1)
            if (nums[0] == 'P') and (type(int(nums[1:3])) == int):
                file_title.append(title)
    return file_title

def create_new(file_title,file_name):   # 函数三    将内容写入目录文件
    create = open(r'E:\学习\Web 前端\目录1.txt','a')
    create.write(file_name)
    create.write('\n')
    for each_new in file_title:
        create.write(each_new)
    create.write('\n')
    create.close() 

print('写入成功！')

    
search(folder)  