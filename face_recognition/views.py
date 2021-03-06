# coding: utf-8
import base64
import json
import math
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from face_recognition.common import *

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognition.settings')
django.setup()


def index(request):
    template_url = os.path.join(settings.BASE_DIR, 'templates/index.html').replace('\\', '/')
    return TemplateResponse(request, template_url, {})


def get_data(request=None):
    result = {'data': '',
              'code': '200'}
    img_path = settings.IMG_BASE_PATH
    acupoints = format_logs()
    try:
        for i, file in enumerate(os.listdir(img_path)):
            f = open(img_path + file, 'rb')
            image_data = f.read()
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            acupoints[i]['data'] = image_b64
            f.close()
        result['data'] = acupoints
    except Exception as e:
        print(e)
        result['code'] = '401'
    print('success!')
    return JsonResponse(result)


@csrf_exempt
def operate(request):
    result = {'data': '',
              'code': '200'}
    if (not request.POST) and (not request.POST['img']):
        result['code'] = '400'
        return JsonResponse(result)
    else:
        try:
            img = base64.b64decode(request.POST['img'])
            pic_name = str(random.randint(1, 1000)) + '.jpg'
            with open(settings.SOURCE_PATH + pic_name, 'wb') as f:
                f.write(img)
            operate_img(pic_name)

            org_point = origin_point_up(pic_name)
            template_img = get_similar(org_point)[0]
            template = format_log(template_img + '.log')

            with open(settings.TARGET_PATH + pic_name, 'rb') as f:
                img_data = f.read()
                img_bs64 = base64.b64encode(img_data).decode('utf-8')

                eyes_coords = []
                face_cascade = cv2.CascadeClassifier(settings.STATIC_PATH + 'classify/haarcascade_eye.xml')
                image_path = settings.TARGET_PATH + pic_name
                img = cv2.imread(image_path)
                if type(img) != str:
                    eyes = face_cascade.detectMultiScale(img, 1.1, 5)
                    print(eyes)
                    if len(eyes):
                        for (x, y, w, h) in eyes:
                            if w >= 70 and h >= 70:
                                eyes_coords.append((x, y))
                processed_data = template
                data_list = []
                processed_data['data'] = img_bs64
                data_list.append(processed_data)
                result['data'] = data_list
            return JsonResponse(result)

        except Exception as e:
            print(e)
            result['code'] = '401'
            return JsonResponse(result)


if __name__ == '__main__':
    get_data()
