from django.shortcuts import render


def singlepage(request):
    return render(request, 'singlepage.html')
