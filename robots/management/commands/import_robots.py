import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from robots.models import Result, Robot
import os


class Command(BaseCommand):

    help = "Import data from csv file"

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        file_path = options['file_path']
        self.import_csv(file_path)

    def import_csv(self, file_path):
        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            # delete all past robots
            Robot.objects.all().delete()
            for row in reader:
                # photo path is "id_name.jpg"
                cwd = os.getcwd()
                name = "_".join(row['name'].split(' '))
                photo_path = f"{row['old_id']}_{name}.jpg"
                print(photo_path)


                Robot.objects.create(
                    robot_id=row['id'],
                    name=row['name'],
                    photo=photo_path,
                    hls=row['hls'],
                    ff=row['ff'],
                    bm=row['bm'],
                    sl=row['sl']
                )
