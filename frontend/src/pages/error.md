INFO:     127.0.0.1:52243 - "POST /articles/21c243b4-59c8-43d2-b4e8-86e2c2bd8b19/publish HTTP/1.1" 500 Internal Server Error
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
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\middleware\cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\starlette\middleware\cors.py", line 144, in simple_response
    await self.app(scope, receive, send)
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
  File "D:\Maanushree\projects\anthology\backend\apis\articles.py", line 121, in publish_article_endpoint
    return await publish_article(article_id, user_id)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\services\article_service.py", line 176, in publish_article
    update_article(article, update_data)
  File "D:\Maanushree\projects\anthology\backend\repos\article_repo.py", line 29, in update_article
    articles_collection.update_one({"id": article_id}, {"$set": update_data})
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\collection.py", line 1336, in update_one
    self._update_retryable(
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\collection.py", line 1118, in _update_retryable
    return self._database.client._retryable_write(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\mongo_client.py", line 2083, in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\mongo_client.py", line 1968, in _retry_with_session
    return self._retry_internal(
           ^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\_csot.py", line 125, in csot_wrapper
    return func(self, *args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\mongo_client.py", line 2014, in _retry_internal
    ).run()
      ^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\mongo_client.py", line 2763, in run
    return self._read() if self._is_read else self._write()
                                              ^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\mongo_client.py", line 2895, in _write
    return self._func(self._session, conn, self._retryable)  # type: ignore
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\collection.py", line 1098, in _update
    return self._update(
           ^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\collection.py", line 1049, in _update
    conn.command(
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\helpers.py", line 47, in inner
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\pool.py", line 426, in command
    self._raise_connection_failure(error)
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\pool.py", line 398, in command
    return command(
           ^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\synchronous\network.py", line 148, in command
    request_id, msg, size, max_doc_size = message._op_msg(
                                          ^^^^^^^^^^^^^^^^
  File "D:\Maanushree\projects\anthology\backend\.venv\Lib\site-packages\pymongo\message.py", line 419, in _op_msg
    return _op_msg_uncompressed(flags, command, identifier, docs, opts)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
bson.errors.InvalidDocument: Invalid document: cannot encode object: ArticleInDB(id='21c243b4-59c8-43d2-b4e8-86e2c2bd8b19', owner_id='maanushree', title='Writing Happens in Layers', content='Writing is rarely a straight line. It begins as fragments, then becomes drafts, then clarity. Anthology is built for that slow unfolding.', status='completed', created_at=datetime.datetime(2026, 2, 12, 13, 6, 31, 614000), updated_at=datetime.datetime(2026, 2, 12, 13, 11, 26, 254000), publication_id=None, published_at=None, scheduled_publish_at=None), of type: <class 'models.articles.ArticleInDB'>
