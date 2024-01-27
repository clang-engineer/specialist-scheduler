package com.clangengineer.scheduler

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@kotlin.annotation.Target(AnnotationTarget.CLASS)
@kotlin.annotation.Retention(AnnotationRetention.RUNTIME)
@SpringBootTest(classes = [SchedulerApplication::class])
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
annotation class IntegrationTest
