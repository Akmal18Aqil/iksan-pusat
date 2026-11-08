<?php

use App\Http\Controllers\AlumniController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\KorwilController;
use App\Http\Controllers\KajianController;
use App\Http\Controllers\WritingController;
use App\Http\Controllers\DzikirController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\KtaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;

// 1. Root redirect
Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

// --- CUSTOM AUTH REGISTER DENGAN THROTTLE (ANTI SPAM BOT) ---
Route::middleware('throttle:5,1')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// 2. Auth Group (Akses untuk semua user login termasuk role Alumni)
Route::middleware(['auth', 'verified'])->group(function () {

    // --- DASHBOARD ---
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // --- ALUMNI ---
    Route::get('/alumni', [AlumniController::class, 'index'])->name('alumni.index');
    Route::post('/alumni', [AlumniController::class, 'store'])->name('alumni.store');
    Route::patch('/alumni/{id}', [AlumniController::class, 'update'])->name('alumni.update');
    Route::delete('/alumni/{id}', [AlumniController::class, 'destroy'])->name('alumni.destroy');
    Route::get('/alumni/map', [AlumniController::class, 'map'])->name('alumni.map');

    // --- KORWIL ---
    Route::get('/korwil', [KorwilController::class, 'index'])->name('korwil.index');
    Route::post('/korwil', [KorwilController::class, 'store'])->name('korwil.store');
    Route::patch('/korwil/{id}', [KorwilController::class, 'update'])->name('korwil.update');
    Route::delete('/korwil/{id}', [KorwilController::class, 'destroy'])->name('korwil.destroy');

    // --- FINANCE ---
    Route::get('/finance', [DonationController::class, 'index'])->name('finance.index');
    Route::post('/finance', [DonationController::class, 'store'])->name('finance.store');
    Route::patch('/finance/{id}', [DonationController::class, 'update'])->name('finance.update');
    Route::delete('/finance/{id}', [DonationController::class, 'destroy'])->name('finance.destroy');
    Route::get('/finance/export', [DonationController::class, 'export'])->name('finance.export');

    // --- KAJIAN ---
    Route::get('/kajian', [KajianController::class, 'index'])->name('kajian');
    Route::post('/kajian', [KajianController::class, 'store'])->name('kajian.store');
    Route::patch('/kajian/{id}', [KajianController::class, 'update'])->name('kajian.update');
    Route::delete('/kajian/{id}', [KajianController::class, 'destroy'])->name('kajian.destroy');

    // --- MENULIS ---
    Route::get('/menulis', [WritingController::class, 'index'])->name('menulis');
    Route::post('/menulis', [WritingController::class, 'store'])->name('writing.store');
    Route::patch('/menulis/{id}', [WritingController::class, 'update'])->name('writing.update');
    Route::delete('/menulis/{id}', [WritingController::class, 'destroy'])->name('writing.destroy');

    // --- KEGIATAN ---
    Route::get('/kegiatan', [ActivityController::class, 'index'])->name('kegiatan');
    Route::post('/kegiatan', [ActivityController::class, 'store'])->name('activity.store');
    Route::patch('/kegiatan/{id}', [ActivityController::class, 'update'])->name('activity.update');
    Route::get('/kegiatan/{id}/edit', [ActivityController::class, 'edit'])->name('activity.edit');
    Route::delete('/kegiatan/{id}', [ActivityController::class, 'destroy'])->name('activity.destroy');

    // --- DZIKIR ---
    Route::get('/dzikir', [DzikirController::class, 'index'])->name('dzikir');
    Route::post('/dzikir', [DzikirController::class, 'store'])->name('dzikir.store');
    Route::patch('/dzikir/{id}', [DzikirController::class, 'update'])->name('dzikir.update');
    Route::delete('/dzikir/{id}', [DzikirController::class, 'destroy'])->name('dzikir.destroy');

    // --- PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- ORGANISASI (AD ART) ---
    Route::get('/organisasi', [OrganizationController::class, 'index'])->name('organisasi');

    // --- ROUTE KOMODITI BISNIS (Akses Aktif untuk Alumni & User Login) ---
    Route::get('/bisnis', [BusinessController::class, 'index'])->name('bisnis');
    Route::post('/bisnis', [BusinessController::class, 'store'])->name('business.store');
    Route::patch('/bisnis/{id}', [BusinessController::class, 'update'])->name('business.update');
    Route::delete('/bisnis/{id}', [BusinessController::class, 'destroy'])->name('business.destroy');

    // --- ROUTE MANAJEMEN ASET ---
    Route::get('/asset', [AssetController::class, 'index'])->name('asset');
    Route::post('/asset', [AssetController::class, 'store'])->name('asset.store');
    Route::patch('/asset/{id}', [AssetController::class, 'update'])->name('asset.update');
    Route::delete('/asset/{id}', [AssetController::class, 'destroy'])->name('asset.destroy');

    // --- ROUTE CETAK KTA ---
    Route::get('/cetak-kta', [KtaController::class, 'index'])->name('kta.index');
    Route::get('/cetak-kta/{id}/pdf', [KtaController::class, 'downloadPdf'])->name('kta.pdf');

    // --- MANAJEMEN USER ---
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/update-password', [UserController::class, 'updatePassword'])->name('users.update-password');

});

// Sisa rute auth bawaan lainnya (login, password reset, dll) dipanggil dari file auth.php
require __DIR__.'/auth.php';