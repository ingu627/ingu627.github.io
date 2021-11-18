---
layout: single
title: "[에러 해결 방법] Kernel died (code: 1). AttributeError: 'SelectIOLoop' object has no attribute 'asyncio_loop'"
categories: error
tag : [error, solution]
toc: true
sidebar_main: true

date: 2021-11-03
last_modified_at: 2021-11-03
---
## 에러 : Kernel died (code: 1). AttributeError: 'SelectIOLoop' object has no attribute 'asyncio_loop
Kernel died (code: 1). AttributeError: 'SelectIOLoop' object has no attribute 'asyncio_loop', C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\traitlets\traitlets.py:2205: FutureWarning: Supporting extra quotes around strings is deprecated in traitlets 5.0. You can use 'hmac-sha256' instead of '"hmac-sha256"' if you require traitlets >=5. FutureWarning) C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\traitlets\traitlets.py:2160: FutureWarning: Supporting extra quotes around Bytes is deprecated in traitlets 5.0. Use 'b0667961-bfc2-4d68-a435-57b7615799ef' instead of 'b"b0667961-bfc2-4d68-a435-57b7615799ef"'. FutureWarning) Traceback (most recent call last): File "C:\Users\poeun\anaconda3\envs\tf2.2\lib\runpy.py", line 193, in _run_module_as_main "__main__", mod_spec) File "C:\Users\poeun\anaconda3\envs\tf2.2\lib\runpy.py", line 85, in _run_code exec(code, run_globals) File "C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\ipykernel_launcher.py", line 16, in <module> app.launch_new_instance() File "C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\traitlets\config\application.py", line 846, in launch_instance app.start() File "C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\ipykernel\kernelapp.py", line 665, in start self.kernel.start() File "C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\ipykernel\ipkernel.py", line 170, in start super(IPythonKernel, self).start() File "C:\Users\poeun\AppData\Roaming\Python\Python37\site-packages\ipykernel\kernelbase.py", line 496, in start asyncio.run_coroutine_threadsafe(self.poll_control_queue(), control_loop.asyncio_loop) AttributeError: 'SelectIOLoop' object has no attribute 'asyncio_loop'

## 해결 방법 : 
`conda install ipykernel --update-deps --force-reinstall`