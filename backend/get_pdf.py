from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import docx2txt
import re
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO



class Item(BaseModel):
    description: str
    filepath: str
    cgpaWeightage : str
    universityWeightage : str
    skillsWeightage: str
    similarityScoreWeightage: str
    highestEducationBonusWeightages : str
    workExperienceWeightage : str
    
def read_docx(fileName):
    text = docx2txt.process(fileName)
    return text


def read_pdf(fileName):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    fp = open(fileName, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos = set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()
    return text


def get_email(resume):
    pattern = re.compile(r'[a-zA-Z0-9-\. ]+@[a-zA-Z-\. ]*\.(com|edu|net|pk)')
    matches = pattern.finditer(resume)
    for match in matches:
        email = match.group(0)
        email = [e for e in email if e != ' ']
        email = ''.join(email)
        return email


def isPhoneNum(number):
    count = 0
    for n in number:
        if n.isdigit():
            count += 1
    return True if count >= 10 else False


def get_contact_num(resume):
    numbers = re.findall(r'[\+\(]?[0-9][0-9 \-\(\)]{8,}[0-9]', resume)
    numbers = list(filter(isPhoneNum, numbers))
    return numbers[0] if len(numbers)>0 else 'Not Found'


def get_gpa_score(resume, item):
    rx = re.findall(r'[0-4][\.][0-9]{2}', resume)
    return [(float(rx[0])/4)*int(item.cgpaWeightage), float(rx[0])] if rx else [(2.2/4)*int(item.cgpaWeightage), 2.2]


def get_highest_education_score(resume, item):
    resume = resume.lower()
    for level in ['masters', 'm.sc', 'msc', ' ms ', ' m.s ', 'mscs', 'mphil', 'ms ', 'm.s ', 'master']:
        if level in resume:
            return [(5/5)*int(item.highestEducationBonusWeightages), 'Masters']

    return [0, 'Bachelors']


def get_university_score(resume, item):
    resume = resume.lower()
    high_ranked = ['nust', 'fast', 'nuces', 'lums', 'giki',
                   'pucit', 'uet', 'pieas', 'university of engineering']
    mid_ranked = ['comsats', 'ucp', 'umt', 'uol', 'islamic', 'numl', 'nutech', 'bahria', 'gcu', 'lcwu',
                  'lahore college', 'gc', 'government college', 'air', 'modern languages', 'central punjab']
    low_ranked = ['superior', 'preston', 'virtual', 'university of sargodha',
                  'uos', 'arid', 'agriculture', 'cust', 'bahauddin', 'islamia', 'ncba&e']

    for university in mid_ranked:
        if university in resume:
            return [(15/25)*int(item.universityWeightage), university]

    for university in low_ranked:
        if university in resume:
            return [(10/25)*int(item.universityWeightage), university]

    for university in high_ranked:
        if university in resume:
            return [(25/25)*int(item.universityWeightage), university]

    return [(10/25)*int(item.universityWeightage), 'University not found']


def get_skillset(resume, item):
    resume=resume.lower()
    resume_stacks=[]
    stacks=['c++','java','python','html','css','sql','.net','flutter','mern','react','mean','angular','node','js','javascript','kotlin','laravel','c#','php','mongo']
    for stack in stacks:
        if stack in resume:
            resume_stacks.append(stack)
            
    return [(len(resume_stacks)/len(stacks))*int(item.skillsWeightage) ,resume_stacks]

def get_experience(resume, item):
    years = re.findall(r"\b(19[5-9]\d|20\d{2})\b", resume)
    years=[int(year) for year in years]
    years.sort()
    if years[-1]-years[0] > 10 and len(years)>2:
        exp=years[-1]-years[1]
        
    else:
        exp=years[-1]-years[0]
        if exp>10:
            exp=1
    # exp =years[-1]-years[0] if len(years)>1 else 1
    exp_score=(exp/20)*int(item.workExperienceWeightage) if (exp/20)*int(item.workExperienceWeightage) < int(item.workExperienceWeightage) else int(item.workExperienceWeightage)
    return [exp_score, exp]

def get_score(content, item):
    cv = CountVectorizer()
    matrix = cv.fit_transform(content)

    similarity_matrix = cosine_similarity(matrix)
    return int(similarity_matrix[0][1]*int(item.similarityScoreWeightage))
app = FastAPI()

@app.post("/uploadfile")
async def create_upload_file(item : Item):
    # response = {"description": description, "filepath": filepath}
    job_description = item.description
    resume=''
    names_scores = []
    if item.filepath[-3:] == 'pdf':
        resume = read_pdf(item.filepath)
    elif item.filepath[-4:] == 'docx':
        resume = read_docx(item.filepath)
        
    if item.filepath[-3:] == 'pdf' or item.filepath[-4:] == 'docx':
        content = [job_description, resume]
        names_scores.append((item.filepath, get_score(content, item), get_email(
            resume), get_contact_num(resume), get_gpa_score(resume, item), get_university_score(resume, item), get_highest_education_score(resume, item), get_skillset(resume, item),get_experience(resume, item), get_contact_num(resume)))

    scores = []
    name_score = names_scores[0]
    scores.append({"score": name_score[1]+name_score[4][0]+name_score[5][0]+name_score[7][0]+name_score[8][0],  "cgpa": name_score[4][1], "university": name_score[5][1], "skills":name_score[7][1],"workExperience":name_score[8][1],"phone":name_score[9]})
    return scores[0]