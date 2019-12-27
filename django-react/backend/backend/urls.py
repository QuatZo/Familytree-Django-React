"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from rest_framework import routers
from familytree import views
from rest_framework_jwt.views import obtain_jwt_token
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'familytreepersons', views.FamilytreePersonView, 'familytreeperson')
router.register(r'familytreerelationship', views.FamilytreeRelationshipView, 'familytreerelationship')
router.register(r'familytreemilestone', views.FamilytreeMilestoneView, 'familytreemilestone')

urlpatterns = [
    path('admin/', admin.site.urls, name="admin"), # admin page
    path('api/', include((router.urls, 'router'), namespace="api"), name="api"), # API pages: person, relationship, milestone
    path('token-auth/', obtain_jwt_token, name="token-auth"), # page to get the token
    path('current_user/', views.current_user, name="current_user"), # page to check if logged in
    path('users/', views.UserList.as_view(), name="users"), # list of users, page to check if specific user exists
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # media (files)
