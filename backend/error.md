INFO:     127.0.0.1:60650 - "PATCH /articles/be7c3fe7-2263-47dc-b6b1-324cfe66fb85/complete-article HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\uvicorn\protocols\http\httptools_impl.py", line 416, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\applications.py", line 1135, in __call__
    await super().__call__(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\applications.py", line 107, in __call__
    await self.middleware_stack(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\middleware\asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\routing.py", line 115, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\routing.py", line 101, in app
    response = await f(request)
               ^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\routing.py", line 355, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\fastapi\routing.py", line 243, in run_endpoint_function
    return await dependant.call(**values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\apis\articles.py", line 54, in complete_article
    article = await get_article_by_id(article_id)
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\services\article_service.py", line 50, in get_article_by_id
    return find_article_by_id(article_id)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\repos\article_repo.py", line 14, in find_article_by_id
    return ArticleInDB(**data)
           ^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pydantic\main.py", line 250, in __init__     
    validated_self = self.__pydantic_validator__.validate_python(data, self_instance=self)
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
pydantic_core._pydantic_core.ValidationError: 1 validation error for ArticleInDB
owner_id
  Field required [type=missing, input_value={'_id': ObjectId('69660f0... 13, 9, 23, 23, 604000)}, input_type=dict]    
    For further information visit https://errors.pydantic.dev/2.12/v/missing