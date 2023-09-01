from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import Http404

import os
DIRNAME = os.path.abspath(os.path.dirname(__file__) + "mysite\\")

def index(request):
    try:
        template = loader.get_template('polls/index.html')
        context = {}
    except:
         Http404("Error in template")
    return HttpResponse(template.render(context, request))


def detail(request):
    try:
        template = loader.get_template('polls/detail.html')
        context = {}
    except:
         Http404("Error in template")
    return HttpResponse(template.render(context, request))


def viewerTest(request):
    try:
        template = loader.get_template('polls/viewerTest.html')
        context = {}
    except:
         Http404("Error in template")
    return HttpResponse(template.render(context, request))


def drawingTest(request):
    try:
        template = loader.get_template('polls/drawingTest.html')
        context = {}
    except:
         Http404("Error in template")
    return HttpResponse(template.render(context, request))