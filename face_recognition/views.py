# coding: utf-8
import base64
from django.http import JsonResponse
from face_recognition.common import *

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognition.settings')
django.setup()

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
    return JsonResponse(result)


def operate(request):
    result = {'data': '',
              'code': '200'}
    if (not request.POST) and (not request.POST['img']):
        result['code'] = '400'
        return JsonResponse(result)
    else:
        try:
            img_bs64 = request.POST['img']
            img = base64.b64decode(img_bs64)
            pic_name = str(random.randint(1, 1000)) + '.jpg'
            with open(settings.SOURCE_PATH + pic_name, 'wb') as f:
                f.write(img)
            operate_img(pic_name)

            with open(settings.TARGET_PATH + pic_name, 'rb') as f:
                img_data = f.read()
                img_bs64 = base64.b64encode(img_data).decode('utf-8')
                result['data'] = img_bs64
            return JsonResponse(result)

        except Exception as e:
            print(e)
            result['code'] = '401'
            return JsonResponse(result)


if __name__ == '__main__':
    get_data()
