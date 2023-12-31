from django.shortcuts import render
from django.http import HttpResponse
from .models import Message

# Create your views here.
def home(request, *args, **kwargs):
    return render(request,'index.html')

def chat(request):
    return render(request, 'index.html')

def reponse(request):
    message = request.GET['msg']
    reponse = get_response(message)
    new_msg = Message.objects.create(value=message, reponse=reponse)
    new_msg.save()
    return HttpResponse(reponse)

#import:
import numpy as np
import pandas as pd
import re
import nltk
import spacy
from nltk.corpus import stopwords
from joblib import load
#end-import

#variable:
stopwords = nltk.corpus.stopwords.words('french')

#load:
model = load('./saveModel/model.joblib')
data = load('./saveModel/data.joblib')

#end-variable


#token:
def tokenizer(sent):
    token = re.split('\W+', str(sent).lower())
    return " ".join([(word) for word in accent(token) if word not in stopwords+accent(stopwords)])
#end token

#accent:
def accent(words):
    dict = {'û':'u', 'ù':'u', 'ü':'u',
            'é':'e', 'è':'e', 'ê':'e', 'ë':'e',
            'à':'a', 'â':'a',
            'î':'i', 'ï':'i',
            'ô':'o','ç':'c'}
    sent = []
    for mot in words:
        mot1 = list(mot)
        for l in mot:
            if l in ['û', 'ù', 'ü', 'é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'ç']:
                mot1[mot1.index(l)] = dict[l]
        sent.append(''.join(mot1))
    return sent
#end-accent


#detect_lang:
def detecte_langage(message):
    languages_shared_words = {}
    # tokenization en mots
    words = re.split('\W+', message)
    for language in ['french', 'english']:
        # stopwords pour chaque langue
        stopwords_liste = stopwords.words(language)
        # on retire les doublons
        words = set([w.lower() for w in words])
        # les mots communs entre stopwords 
        # d'une langue et les mots de message
        common_elements = words.intersection(stopwords_liste)
        # ajout du couple au dictionnaire
        languages_shared_words[language] = len(common_elements)
    # on retourne la langue avec le max de mots commun
    return  max(languages_shared_words, key = languages_shared_words.get)

#most_similarity:
nlp = spacy.load('fr_core_news_md')
def most_similary(text):
    token = nlp(tokenizer(text))
    sim = data['Questions'].apply(lambda x: nlp(tokenizer(x)).similarity(token))
    i = np.argmax(sim)
    return data['Questions'][i], sim[i]
#end most_similarity

def get_response(message):
    msg, max_sim = most_similary(message)
    if max_sim >= 0.6:
        msg = pd.DataFrame(np.array([[msg]]))
        msg_t = msg[0].apply(tokenizer)
        msg_f = msg_t.apply(lambda x: nlp(x).vector)
        return model.predict(msg_f.to_list())
    elif max_sim >=0.5:
        return "Je ne vous comprends pas bien, s'il-vous-plait veuillez reformuler"
    elif max_sim >=0.4:
        return "Je ne peux vous repondre, cette question est au dela de mes competenses"
    else:
        return "Desolé, je ne suis capable de repondre qu'aux question qui ont trait a l'ENSPD"
        