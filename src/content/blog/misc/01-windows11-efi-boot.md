---
title: "新装 Windows 11 拔掉 U 盘就无法启动：EFI 写错盘了"
categories: 杂谈
tags: ['Windows', '装机', 'UEFI', 'EFI']
id: "misc-windows11-efi-boot"
date: 2026-07-18 05:40:00
cover: "/assets/images/covers/misc/01-windows11-efi-boot.svg"
hide: false
recommend: false
top: false
---

:::note
微 PE 装 Win11 后，插着 U 盘能进系统，拔掉重启就报 `Reboot and Select proper Boot Device`。不是系统坏了，是 EFI 装到 U 盘上了。下面是排查和修复过程。
:::

## 配置

- CPU：AMD Ryzen 7 9700X
- 主板：MSI B650I
- 系统盘：NVMe SSD（C 331GB + D 600GB）
- 安装方式：微 PE 跑 Windows Setup

## 现象

Windows 已经装好，插着微 PE U 盘可以正常进系统，进了之后拔掉 U 盘继续用也没事。但**关机再开机**就会报：

```text
Reboot and Select proper Boot Device
or Insert Boot Media in selected Boot device
```

BIOS 里 Boot Option #1 是 `UEFI Hard Disk`，Boot Menu 里能看到 SSD，但没有 **Windows Boot Manager**。

更怪的一点：F11 选 `UEFI: 微 PE U 盘` 启动，会直接进已经装好的 Windows。说明系统本身没问题，坏的是启动链。

## 排查

进 Windows 打开磁盘管理，系统盘分区是：

```text
15MB MSR
600GB D
331GB C
```

正常 GPT 安装一般会有 **EFI System Partition**，这里没有。也就是说：Windows 在 SSD 上，启动文件不在。

## 原因

回想安装过程：微 PE → 跑 Windows Setup 时有一步让选「引导驱动器（Boot Drive）」，当时选成了 **U 盘**。

结果就是：

- 系统文件 → SSD
- EFI / Boot Manager → U 盘

所以插着 U 盘能启动，拔掉就找不到 Boot Manager。BIOS 里看不到 Windows Boot Manager，也是同一个原因。

## 修复（不用重装）

### 1. 腾出空间

在磁盘管理里把 C 盘压缩出约 **300MB** 未分配空间。

### 2. 建 EFI 分区

管理员 CMD：

```cmd
diskpart
select disk 0
create partition efi size=260
format fs=fat32 quick label=EFI
list volume
```

找到刚建的 260MB FAT32 卷，分配盘符（把 `X` 换成自己的卷号）：

```cmd
select volume X
assign letter=S
exit
```

### 3. 写入启动文件

```cmd
bcdboot C:\Windows /s S: /f UEFI
```

成功会提示 `Boot files successfully created.`（中文系统一般是「已成功创建启动文件。」）

### 4. 改启动项

重启进 BIOS，这时应能看到 **Windows Boot Manager**。把它设为 Boot Option #1，保存退出。拔掉 U 盘，应从 SSD 正常进 Windows。