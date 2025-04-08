import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './components/payment/payment/payment.component';
import { ApprovPaymentComponent } from './components/payment/approv-payment/approv-payment.component';
import { TeacherDashComponent } from './components/teacherDash/teacher-dash/teacher-dash.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { StudentComponent } from './components/student/student.component';
import { PaperComponent } from './components/paper/paper.component';
import { ExamComponent } from './components/exam/exam.component';
import { ClassComponent } from './components/class/class.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { SignStudentComponent } from './components/sign-student/sign-student.component';
import { LoginStudentComponent } from './components/login-student/login-student.component';
import { PolicyComponent } from './components/policy/policy.component';
import { CovenantsComponent } from './components/covenants/covenants.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PrepExamComponent } from './components/prep-exam/prep-exam.component';
import { DegreeComponent } from './components/degree/degree.component';
import { ExamPaperComponent } from './components/exam-paper/exam-paper.component';
import { TestComponent } from './components/test/test.component';
import { AdminComponent } from './components/admin/admin.component';
import { SkillsComponent } from './components/skills/skills.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { Curriculum2Component } from './components/curriculum2/curriculum2.component';
import { StudyScheduleComponent } from './components/study-schedule/study-schedule.component';
import { StudentTransComponent } from './components/student-trans/student-trans.component';
import { ReasonTransferComponent } from './components/reason-transfer/reason-transfer.component';
import { MainSkillsComponent } from './components/main-skills/main-skills.component';
import { FinalScheduleComponent } from './components/final-schedule/final-schedule.component';
import { StatementComponent } from './components/statement/statement.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExamTeacherComponent } from './components/SuperAdmin/exam-teacher/exam-teacher.component';
import { PrepExamTeacherComponent } from './components/SuperAdmin/prep-exam-teacher/prep-exam-teacher.component';
import { WorkPaperComponent } from './components/SuperAdmin/work-paper/work-paper.component';
import { MaterialComponent } from './components/material/material.component';
import { StagesComponent } from './components/stages/stages.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { SubjectComponent } from './components/subject/subject.component';
import { SubscripeDetailsComponent } from './components/subscripe-details/subscripe-details.component';
import { PackageComponent } from './components/package/package.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { RatingComponent } from './components/rating/rating.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { UsersComponent } from './components/users/users.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { BankqComponent } from './components/bankq/bankq.component';
import { QuesComponent } from './components/SuperAdmin/ques/ques.component';
import { LessonComponent } from './components/SuperAdmin/lesson/lesson.component';
import { PrepPolicyComponent } from './components/prep-policy/prep-policy.component';
import { PrepConvenantsComponent } from './components/prep-convenants/prep-convenants.component';
import { BillsComponent } from './components/bills/bills.component';
import { RequestsComponent } from './components/requests/requests.component';
import { CommonQuestionComponent } from './components/common-question/common-question.component';
import { TechnicalComponent } from './components/technical/technical.component';
import { TableComponent } from './components/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ListDegreeComponent } from './components/list-degree/list-degree.component';
import { FollowingComponent } from './components/following/following.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { InteractionComponent } from './components/interaction/interaction.component';
import { LessonCardComponent } from './components/lesson-card/lesson-card.component';
import { HorizontalScrollDirective } from './horizontal-scroll.directive';
import { ContentEditablePlaceholderDirective } from './content-editable-placeholder.directive';
import { PointsComponent } from './components/points/points.component';
import { PrepPaperComponent } from './components/prep-paper/prep-paper.component';
import { ActionsComponent } from './components/actions/actions/actions.component';
import { BehaiveComponent } from './components/behaive/behaive/behaive.component';
import { InteractionTableComponent } from './components/interaction-table/interaction-table.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { ImagesViewerComponent } from './components/images-viewer/images-viewer.component';
import { VideosViewerComponent } from './videos-viewer/videos-viewer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AddLessonComponent } from './components/add-lesson/add-lesson.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditLessonComponent } from './components/edit-lesson/edit-lesson.component';



@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    LoginFormComponent,
    HomeComponent,
    SignUpComponent,
    PaymentComponent,
    ApprovPaymentComponent,
    TeacherDashComponent,
    SettingsComponent,
    ProfileComponent,
    MainComponent,
    StudentComponent,
    PaperComponent,
    ExamComponent,
    ClassComponent,
    StudentProfileComponent,
    SignStudentComponent,
    LoginStudentComponent,
    PolicyComponent,
    CovenantsComponent,
    PrepExamComponent,
    DegreeComponent,
    ExamPaperComponent,
    TestComponent,
    AdminComponent,
    SkillsComponent,
    CertificatesComponent,
    CurriculumComponent,
    Curriculum2Component,
    StudyScheduleComponent,
    StudentTransComponent,
    ReasonTransferComponent,
    MainSkillsComponent,
    FinalScheduleComponent,
    StatementComponent,
    SubscriptionComponent,
    ExamTeacherComponent,
    PrepExamTeacherComponent,
    WorkPaperComponent,
    MaterialComponent,
    StagesComponent,
    ClassroomComponent,
    SubjectComponent,
    SubscripeDetailsComponent,
    PackageComponent,
    PricingComponent,
    RatingComponent,
    QuestionsComponent,
    UsersComponent,
    PermissionsComponent,
    BankqComponent,
    QuesComponent,
    LessonComponent,
    PrepPolicyComponent,
    PrepConvenantsComponent,
    BillsComponent,
    RequestsComponent,
    CommonQuestionComponent,
    TechnicalComponent,
    TableComponent,
    ListDegreeComponent,
    FollowingComponent,
    InteractionComponent,
    LessonCardComponent,
    HorizontalScrollDirective,
    ContentEditablePlaceholderDirective,
    PointsComponent,
    PrepPaperComponent,
    ActionsComponent,
    BehaiveComponent,
    InteractionTableComponent,
    PdfViewerComponent,
    ImagesViewerComponent,
    VideosViewerComponent,
    NavbarComponent,
    AddLessonComponent,
    EditLessonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatIconModule,
    RouterModule,
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
