from docx import Document


doc = Document(r'E:\学习\Web 前端\a.docx')
doc.add_paragraph(u'第一段',style=None)
doc.save(r'E:\学习\Web 前端\a.docx')