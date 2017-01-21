import base64
import numpy
import hickle
from PIL import Image
from io import BytesIO

def image_data2array(uid, frame, b64data):
    image_data = Image.open(BytesIO(base64.b64decode(b64data))).getdata()
    image_array = numpy.asarray(image_data)
    data = { 
        'uid': uid,
        'frame': frame,
        'data': image_array
        }
    return data

def batch_convert(inc_data_list):
    data_list = []
    for data in inc_data_list:
        data_list.append(image_data2array(*data))
    return data_list

def store_array(array_list,filename):
    with open(filename, 'w+') as f:
        hickle.dump(array_list, filename+'.hkl')

def retrieve_array(filename):
    with open(filename) as f:
        array_list = hickle.load(filename)
# ######turn b64 string into jpg and save
# filename = 'example_b64_str_img.txt'
# with open(filename) as f:
#     img_data = base64.b64decode(f.read().strip())
# with open(filename + '.jpg','w+') as f:
#     f.write(img_data)

######## testing 
# filename = 'example_b64_str_img.txt'
# with open(filename) as f:
#     img_data = f.read().strip()
#     test = []
#     for i in range(5):
#         test.append((i,i,img_data))
#     result = batch_convert(test)
#     print result[3]