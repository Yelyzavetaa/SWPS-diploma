from django.shortcuts import render
from django.http import JsonResponse
from .models import Result, Robot

# Create your views here.

def main(request):
    # Fetch data from Result model
    results_data = list(Result.objects.values())
    return render(request, 'main.html', {'robots': Robot.objects.all().order_by("robot_id"), 'results_data': results_data})

def get_results_data(request):
    # Fetch data from Result model and return as JSON response
    results_data = list(Result.objects.values())
    return JsonResponse(results_data, safe=False)

def get_robot_data(request):
    # Fetch data from Result model and return as JSON response
    robot_data = list(Robot.objects.values())
    print(robot_data)
    return JsonResponse(robot_data, safe=False)